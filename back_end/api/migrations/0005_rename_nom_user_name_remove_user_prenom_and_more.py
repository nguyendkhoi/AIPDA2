# Generated by Django 5.2 on 2025-05-18 15:57

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0004_user_telephone'),
    ]

    operations = [
        migrations.RenameField(
            model_name='user',
            old_name='nom',
            new_name='name',
        ),
        migrations.RemoveField(
            model_name='user',
            name='prenom',
        ),
        migrations.AlterField(
            model_name='user',
            name='first_name',
            field=models.CharField(blank=True, max_length=100, null=True),
        ),
    ]
