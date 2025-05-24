from rest_framework import serializers
from .models import User, Programme, Registration, Expertise

# User
class NestedUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'email', 'first_name', 'name', 'role', 'photo']
        read_only_fields = fields

class UserSerializers(serializers.ModelSerializer):
    password2 = serializers.CharField(write_only=True)
    expertises = serializers.ListField(
        child=serializers.CharField(max_length=100),
        required=False,
        allow_empty=True
    )

    class Meta:
        model = User
        fields = ['id', 'email', 'first_name', 'name', 'role', 'telephone',
                   'pays_residence', 'bio','expertises', 'profession', 'photo',
                     'organisation', 'lien_portfolio', 'creation_date', 'password', 'password2']
        extra_kwargs = {
            'password': {'write_only': True},
            'id': {'read_only': True},
            'email': {'required': True}
            }
        
    def validate_email(self, value):
        if User.objects.filter(email__iexact=value).exists():
            raise serializers.ValidationError("Un compte existe avec cet email. Connectez-vous.")
        return value
    
    def validate(self, data):
        if data['password'] != data['password2']:
            raise serializers.ValidationError("Les mots de passe ne correspondent pas")
        return data
    
    def create(self, validated_data):
        expertises_data = validated_data.pop('expertises', [])
        validated_data.pop('password2', None)

        email = validated_data.pop('email')
        password = validated_data.pop('password')
        user = User.objects.create_user(email=email, password=password, **validated_data)

        for expertise_name in expertises_data:
            expertise, created = Expertise.objects.get_or_create(name=expertise_name.strip())
            user.expertises.add(expertise)

        return user
    
    def update(self, instance, validated_data):
        expertises_data = validated_data.pop('expertises', [])
        # Mettre à jour les autres champs de l'utilisateur
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()

        # Gérer les expertises
        instance.expertises.clear()  # Supprimer les expertises existantes
        for expertise_name in expertises_data:
            expertise, created = Expertise.objects.get_or_create(name=expertise_name.strip())
            instance.expertises.add(expertise)

        return instance
    
class UserCommunitySerializers(serializers.ModelSerializer):
    full_name  = serializers.SerializerMethodField()
    expertises = serializers.SerializerMethodField(read_only=True)

    class Meta:
        fields = ['full_name', 'role', 'photo', 'profession', 'expertises']

    def get_full_name(self, obj):
        return f"{obj.name} {obj.first_name}".strip() if obj.name or obj.first_name else obj.email
    
    def get_expertises(self, instance):
        return [expertise.name for expertise in instance.expertises.all()]
    
class UserProfileSerializers(serializers.ModelSerializer):
    expertises_input = serializers.ListField(
        child=serializers.CharField(max_length=100, allow_blank=False),
        required=False,
        allow_empty=True,
        write_only=True,
        source='expertises'
    )

    expertises = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = User
        fields = ['name', 'bio', 'expertises_input', 'expertises']

    def get_expertises(self, instance):

        return [expertise.name for expertise in instance.expertises.all()]
    
    def update(self, instance, validated_data):
        # Mettre à jour 'nom' et 'bio' normalement
        instance.name = validated_data.get('name', instance.name)
        instance.bio = validated_data.get('bio', instance.bio)

        # Gérer le champ 'expertises' s'il est présent dans les données validées
        if 'expertises' in validated_data:
            expertises_names = validated_data.get('expertises') # Ceci sera une liste de chaînes
            
            instance.expertises.clear()  # Supprimer les anciennes relations d'expertise pour cet utilisateur
            for expertise_name in expertises_names:
                expertise_obj, created = Expertise.objects.get_or_create(
                    name=expertise_name.strip()
                )
                print("expertise:", expertise_name)

                instance.expertises.add(expertise_obj)
        
        instance.save()  # Sauvegarder l'instance User avec toutes les modifications
        return instance

class UserDetailSerializer(serializers.ModelSerializer):
     class Meta:
        model = User
        fields = ['id', 'email', 'first_name', 'name', 
                  'role', 'telephone', 'pays_residence', 'bio','expertises', 'profession', 'organisation', 
                  'lien_portfolio', 'creation_date']
        read_only_fields = fields
        
# Programme
class ProgrammeSerializers(serializers.ModelSerializer):
    animateur = NestedUserSerializer(read_only=True)

    class Meta:
        model = Programme
        fields = ['id', 'name', 'animateur', 'statut', 'edition_du_Tour', 'current_participant_count',
                  'nb_participants_max', 'duration_hours', 
                  'theme', 'start_date', 'description', 'creation_date']
        extra_kwargs = {
            'id': {'read_only': True},
            'statut': {'required': False}
            }
        
    def validate_name(self, value):
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
    
class ProgrammeSpecificSerializer(serializers.ModelSerializer):
    participants = NestedUserSerializer(many=True, read_only=True)

    class Meta:
        model = Programme
        fields = [
            'name',
            'edition_du_Tour',
            'nb_participants_max', 
            'current_participant_count',  
            'participants',          
            'duration_hours',
            'theme',
            'start_date',
            'description',
            'creation_date',
            'statut',
        ]
    
class NestedProgramme(serializers.ModelSerializer):
    class Meta:
        model = Programme
        fields = ['id', 'name', 'edition_du_Tour', 'start_date']
        read_only_fields = fields

# Registration
class RegistrationSerializers(serializers.ModelSerializer):
    programme = NestedProgramme(read_only=True)

    class Meta:
        model = Registration
        fields = ['programme', "statut", "date_inscription"]
        read_only_fields = fields