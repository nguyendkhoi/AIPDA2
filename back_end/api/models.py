from django.db import models
from django.contrib.auth.models import AbstractUser, BaseUserManager

# Create your models here.    
class CustomUserManager(BaseUserManager):
    """
    Custom user model manager where email is the unique identifiers
    for authentication instead of usernames.
    """
    def create_user(self, email, password, **extra_fields):
        """
        Create and save a User with the given email and password.
        """
        if not email:
            raise ValueError('The Email must be set')
        email = self.normalize_email(email)
        # Ne passe PAS username ici, seulement email et les extra_fields
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user
    
    def create_superuser(self, email, password=None, **extra_fields):
        """
        Creates and saves a superuser with the given email and password.
        """
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        extra_fields.setdefault('is_active', True)

        if extra_fields.get('is_staff') is not True:
            raise ValueError('Superuser must have is_staff=True.')
        if extra_fields.get('is_superuser') is not True:
            raise ValueError('Superuser must have is_superuser=True.')
        return self.create_user(email, password, **extra_fields)

class Expertise(models.Model):
    nom = models.CharField(max_length=100, unique=True)
    def __str__(self):
        return self.nom

class User(AbstractUser):
    ROLE_CHOICES = [
        ('participant', 'Participant'),
        ('animateur', 'Animateur'),
    ]
    username = None
    email = models.EmailField(('email address'), unique=True)
    nom = models.CharField(max_length=100, blank=True, null=True)
    prenom = models.CharField(max_length=100, blank=True, null=True)
    role = models.CharField(max_length=20, choices=ROLE_CHOICES)
    telephone = models.CharField(max_length=20, blank=True, null=True)
    pays_residence = models.CharField(max_length=100, blank=True, null=True)
    profession = models.CharField(max_length=100, blank=True, null=True)
    organisation = models.CharField(max_length=100, blank=True, null=True)
    lien_portfolio = models.URLField(blank=True, null=True)
    date_de_creation = models.DateTimeField(auto_now_add=True)
    bio = models.TextField(blank=True, null=True)
    expertises = models.ManyToManyField(Expertise, related_name='users', blank=True)
    photo = models.ImageField(upload_to='photos/', blank=True, null=True)

    USERNAME_FIELD = 'email'

    objects = CustomUserManager()
    
    REQUIRED_FIELDS = []
    def __str__(self):
        return f"{self.nom} {self.prenom}"
    
class Programme(models.Model):
    NOM_CHOICES = [
        ('webinaire', 'Webinaire'),
        ('atelier', 'Atelier'),
        ('talk', 'Talk')
    ]
    STATUT_CHOICES = [
        ('en_attente', 'En attente'),
        ('confirme', 'Confirmé'),
        ('annule', 'Annulé'),
    ]
    nom = models.CharField(max_length=100, blank=True, null=True, choices=NOM_CHOICES)
    theme = models.CharField(max_length=100, blank=True, null=True)
    animateur = models.ForeignKey(User, on_delete=models.CASCADE, related_name='programmes_animateur')
    edition_du_Tour = models.CharField(max_length=20, blank=True, null=True)
    statut = models.CharField(max_length=20, default='en_attente', choices=STATUT_CHOICES)  # 'en_attente', 'confirme', 'annule'
    nb_participants_max = models.PositiveIntegerField(default=0)
    participants = models.ManyToManyField(User, related_name='programmes_participant', blank=True)
    temps_de_participation = models.IntegerField(default=0)
    date_de_debut = models.DateTimeField()
    description = models.TextField(blank=True, null=True)
    date_de_creation = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.nom

class Registration(models.Model):
    STATUT_CHOICES = [
        ('inscrit', 'Inscrit'), # Sửa 'registre' thành 'inscrit' cho nhất quán với views.py
        ('annule', 'Annulé'),
    ]
    participant = models.ForeignKey(User, on_delete=models.CASCADE, related_name='registrations_participant')
    programme = models.ForeignKey(Programme, on_delete=models.CASCADE, related_name='registrations')
    date_inscription = models.DateTimeField(auto_now_add=True)
    statut = models.CharField(max_length=20, default='registre', choices=STATUT_CHOICES)  # 'inscrit', 'annule'
    def __str__(self):
        return f"{self.participant.email} - {self.programme.nom}"
