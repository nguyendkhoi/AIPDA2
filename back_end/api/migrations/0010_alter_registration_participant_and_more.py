# Generated by Django 5.2 on 2025-05-21 11:23

import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0009_remove_programme_participants_alter_programme_statut_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='registration',
            name='participant',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='registrations_as_participant', to=settings.AUTH_USER_MODEL),
        ),
        migrations.AlterField(
            model_name='registration',
            name='statut',
            field=models.CharField(choices=[('inscrit', 'Inscrit'), ('en_cours', 'En cours'), ('annule', 'Annulé'), ('success', 'Succès')], default='inscrit', max_length=20),
        ),
        migrations.AlterUniqueTogether(
            name='registration',
            unique_together={('participant', 'programme', 'statut')},
        ),
    ]
