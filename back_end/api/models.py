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
    name = models.CharField(max_length=100, unique=True)
    def __str__(self):
        return self.name

class User(AbstractUser):
    ROLE_CHOICES = [
        ('participant', 'Participant'),
        ('animateur', 'Animateur'),
        ('admin', "Admin")
    ]
    username = None
    email = models.EmailField(('email address'), unique=True)
    name = models.CharField(max_length=100, blank=True, null=True)
    first_name = models.CharField(max_length=100, blank=True, null=True)
    role = models.CharField(max_length=20, choices=ROLE_CHOICES)
    telephone = models.CharField(max_length=20, blank=True, null=True)
    pays_residence = models.CharField(max_length=100, blank=True, null=True)
    profession = models.CharField(max_length=100, blank=True, null=True)
    organisation = models.CharField(max_length=100, blank=True, null=True)
    lien_portfolio = models.URLField(blank=True, null=True)
    creation_date = models.DateTimeField(auto_now_add=True)
    bio = models.TextField(blank=True, null=True)
    expertises = models.ManyToManyField(Expertise, related_name='users', blank=True)
    photo = models.ImageField(upload_to='photos/', blank=True, null=True)

    USERNAME_FIELD = 'email'

    objects = CustomUserManager()
    
    REQUIRED_FIELDS = []
    def __str__(self):
        return f"{self.name} {self.first_name}"
    
class Programme(models.Model):
    NAME_CHOICES = [
        ('webinaire', 'Webinaire'),
        ('atelier', 'Atelier'),
        ('talk', 'Talk')
    ]
    STATUS_CHOICES = [
        ('confirmed', 'Confirmed'),
        ('terminated', 'Terminated'),
        ('in_progress', 'In progress'),
        ('cancelled', 'Cancelled'),
    ]
    name = models.CharField(max_length=100, blank=True, null=True, choices=NAME_CHOICES)
    theme = models.CharField(max_length=100, blank=True, null=True)
    animateur = models.ForeignKey(User, on_delete=models.CASCADE, related_name='programmes_animateur')
    edition_du_Tour = models.CharField(max_length=20, blank=True, null=True)
    status = models.CharField(max_length=20, default='in_progress', choices=STATUS_CHOICES)
    nb_participants_max = models.PositiveIntegerField(default=0)
    duration_hours = models.IntegerField(default=0)
    start_date = models.DateTimeField()
    description = models.TextField(blank=True, null=True)
    creation_date = models.DateTimeField(auto_now_add=True)
    
    @property
    def current_participant_count(self):
        return self.registrations.filter(status='inscrit').count()

    def __str__(self):
        return self.name

class Registration(models.Model):
    STATUT_CHOICES = [
        ('registered', 'Registered'),
        ('cancelled', 'Cancelled'),
        ('success', 'Success'),
    ]
    participant = models.ForeignKey(User, on_delete=models.CASCADE, related_name='registrations_as_participant')
    programme = models.ForeignKey(Programme, on_delete=models.CASCADE, related_name='registrations')
    date_inscription = models.DateTimeField(auto_now_add=True)
    status = models.CharField(max_length=20, default='inscrit', choices=STATUT_CHOICES)  # 'inscrit', 'en_cours', 'annule'
    class Meta:
        unique_together = ('participant', 'programme', 'status')

    def __str__(self):
        programme_title = self.programme.theme or self.programme.get_name_display()
        return f"{self.participant.email} - {programme_title} ({self.get_statut_display()})"
