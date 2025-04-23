from rest_framework import serializers
from .models import User, Programme, Registration

# User
class NestedUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'email', 'prenom', 'nom', 'role', 'photo']
        read_only_fields = fields

class UserSerializers(serializers.ModelSerializer):
    password2 = serializers.CharField(write_only=True)
    class Meta:
        model = User
        fields = ['id', 'email', 'prenom', 'nom', 'role', 'telephone',
                   'pays_residence', 'bio','expertises', 'profession', 'photo',
                     'organisation', 'lien_portfolio', 'date_de_creation', 'password', 'password2']
        extra_kwargs = {
            'password': {'write_only': True},
            'id': {'read_only': True},
            'email': {'required': True}
            }
        
    def validate_email(self, value):
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError("Un compte existe déjà avec cet email. Veuillez vous connecter.")
        return value
    
    def validate(self, data):
        if data['password'] != data['password2']:
            raise serializers.ValidationError("Les mots de passe ne correspondent pas")
        return data
    
    def create(self, validated_data):
        validated_data.pop('password2', None)

        email = validated_data.pop('email')
        password = validated_data.pop('password')
        user = User.objects.create_user(email=email, password=password, **validated_data)


        return user
    
class UserProfileSerializers(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['nom', 'bio', 'expertises']   

class UserDetailSerializer(serializers.ModelSerializer):
     class Meta:
        model = User
        fields = ['id', 'email', 'prenom', 'nom', 'role', 'telephone', 'pays_residence', 'bio','expertises', 'profession', 'organisation', 'lien_portfolio', 'date_de_creation']
        read_only_fields = fields
        
# Programme
class ProgrammeSerializers(serializers.ModelSerializer):
    animateur = NestedUserSerializer(read_only=True)
    participants = NestedUserSerializer(many=True, read_only=True)
    nb_participants_actuel = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = Programme
        fields = ['id', 'nom', 'animateur', 'statut', 'edition_du_Tour', 'nb_participants_actuel',
                  'nb_participants_max', 'participants', 'temps_de_participation', 
                  'theme', 'date_de_debut', 'description', 'date_de_creation']
        extra_kwargs = {
            'id': {'read_only': True},
            'statut': {'required': False}
            }
        
    def validate_nom(self, value):
        if not value:
            raise serializers.ValidationError("Le nom du programme est requis.")
        if (value.lower() not in ['webinaire', 'atelier', 'talk']):
            raise serializers.ValidationError("Le nom du programme doit être 'webinaire', 'atelier' ou 'talk'.")
        return value
    
    def validate(self, data):
        if data['nb_participants_max'] < 0:
            raise serializers.ValidationError("Le nombre de participants maximum ne peut pas être négatif.")
        return data
    
    def create(self, validated_data):
        programme = Programme.objects.create(**validated_data)
        return programme
    
    def get_nb_participants_actuel(self, obj):
        if hasattr(obj, 'participants') and obj.participants.exists():
             return obj.participants.count()
        elif hasattr(obj, '_prefetched_objects_cache') and 'participants' in obj._prefetched_objects_cache:
             return len(obj._prefetched_objects_cache['participants'])
        return 0

class ProgrammeSpecificSerializer(serializers.ModelSerializer):
    participants = NestedUserSerializer(many=True, read_only=True)
    nb_participants_actuel = serializers.SerializerMethodField()

    class Meta:
        model = Programme
        fields = [
            'nom',
            'edition_du_Tour',
            'nb_participants_max', 
            'nb_participants_actuel',  
            'participants',          
            'temps_de_participation',
            'theme',
            'date_de_debut',
            'description',
            'date_de_creation',
            'statut',
        ]

    def get_nb_participants_actuel(self, obj):
        if hasattr(obj, '_prefetched_objects_cache') and 'participants' in obj._prefetched_objects_cache:
             return len(obj._prefetched_objects_cache['participants'])
        elif hasattr(obj, 'participants'):
             return obj.participants.count()
        return 0
    
class NestedProgramme(serializers.ModelSerializer):
    class Meta:
        model = Programme
        fields = ['id', 'nom', 'edition_du_Tour', 'date_de_debut']
        read_only_fields = fields

# Registration
class RegistrationSerializers(serializers.ModelSerializer):
    programme = NestedProgramme(read_only=True)

    class Meta:
        model = Registration
        fields = ['programme', "statut", "date_inscription"]
        read_only_fields = fields
