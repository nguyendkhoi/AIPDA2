from rest_framework import serializers
from .models import User, Programme, Registration

class UserSerializers(serializers.ModelSerializer):
    password2 = serializers.CharField(write_only=True)
    class Meta:
        model = User
        fields = ['id', 'email', 'prenom', 'nom', 'role', 'telephone', 'pays_residence', 'bio','expertises', 'profession', 'organisation', 'lien_portfolio', 'date_de_creation', 'password', 'password2']
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

class ProgrammeSerializers(serializers.ModelSerializer):
    animateur = UserSerializers(read_only=True)
    participants = UserSerializers(many=True, read_only=True)
    class Meta:
        model = Programme
        fields = ['id', 'nom', 'animateur', 'statut', 'edition_du_Tour', 'nb_participants_max', 'participants', 'temps_de_participation', 'theme', 'date_de_debut', 'description', 'date_de_creation']
        extra_kwargs = {
            'id': {'read_only': True},
            'statut': {'required': False}
            }
        
    def validate_nom(self, value):
        if not value:
            raise serializers.ValidationError("Le nom du programme est requis.")
        if (value.lower() not in ['webinaire', 'atelier', 'talk']):
            raise serializers.ValidationError("Le nom du programme doit être 'webinaire', 'atelier' ou 'talk'.")
        return value.lower()
    def validate(self, data):
        if data['nb_participants_max'] < 0:
            raise serializers.ValidationError("Le nombre de participants maximum ne peut pas être négatif.")
        return data
    def create(self, validated_data):
        programme = Programme.objects.create(**validated_data)
        return programme

    def update(self, instance, validated_data):
        participants_data = validated_data.pop('participants', [])
        instance.nom = validated_data.get('nom', instance.nom)
        instance.animateur = validated_data.get('animateur', instance.animateur)
        instance.edition_du_Tour = validated_data.get('edition_du_Tour', instance.edition_du_Tour)
        instance.nb_participants_max = validated_data.get('nb_participants_max', instance.nb_participants_max)
        instance.temps_de_participation = validated_data.get('temps_de_participation', instance.temps_de_participation)
        instance.date_de_debut = validated_data.get('date_de_debut', instance.date_de_debut)
        instance.description = validated_data.get('description', instance.description)

        # Mettre à jour les participants
        if participants_data:
            instance.participants.clear()
            for participant_data in participants_data:
                instance.participants.add(participant_data)

        instance.save()
        return instance

class ProgrammeSpecificSerializer(serializers.ModelSerializer):
    participants = UserSerializers(many=True, read_only=True)

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
        """
        Contabilise le nombre de participants actuels pour un programme donné.
        """
        if hasattr(obj, 'participants'):
            return obj.participants.count()
        return 0 
    
class NestedProgramme(serializers.ModelSerializer):
    class Meta:
        model = Programme
        fields = ['id', 'nom', 'edition_du_Tour', 'date_de_debut']
        read_only_fields = fields
    
class RegistrationSerializers(serializers.ModelSerializer):
    programme = ProgrammeSerializers(source='programme', read_only=True)

    class Meta:
        model = Registration
        fields = ['programme', "statut", "date_inscription"]
        read_only_fields = fields

class UserProfileSerializers(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['nom', 'bio', 'expertises']   