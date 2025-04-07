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


class User(AbstractUser):
    username = None
    email = models.EmailField(('email address'), unique=True)
    nom = models.CharField(max_length=100, blank=True, null=True)
    prenom = models.CharField(max_length=100, blank=True, null=True)
    role = models.CharField(max_length=20)
    telephone = models.CharField(max_length=20)
    pays_residence = models.CharField(max_length=100, blank=True, null=True)
    profession = models.CharField(max_length=100, blank=True, null=True)
    organisation = models.CharField(max_length=100, blank=True, null=True)
    lien_portfolio = models.URLField(blank=True, null=True)
    date_de_creation = models.DateField(auto_now_add=True)

    USERNAME_FIELD = 'email'

    objects = CustomUserManager()
    
    REQUIRED_FIELDS = []
    def __str__(self):
        return f"{self.nom} {self.prenom}"
    
class Programme(models.Model):
    CHOICES = [
        ('webinaire', 'Webinaire'),
        ('atelier', 'Atelier'),
        ('talk', 'Talk')
    ]
    nom = models.CharField(max_length=100, blank=True, null=True, choices=CHOICES)
    animateur = models.ForeignKey(User, on_delete=models.CASCADE, related_name='programmes_animateur')
    edition_du_Tour = models.CharField(max_length=20, blank=True, null=True)
    nb_participants_max = models.IntegerField(default=0)
    participants = models.ManyToManyField(User, related_name='programmes_participant', blank=True)
    temps_de_participation = models.IntegerField(default=0)
    date_de_debut = models.DateField()
    description = models.TextField(blank=True, null=True)
    date_de_creation = models.DateField(auto_now_add=True)

    def __str__(self):
        return self.nom