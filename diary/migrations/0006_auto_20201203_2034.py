# Generated by Django 3.0.8 on 2020-12-04 01:34

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('diary', '0005_remove_reminders_body'),
    ]

    operations = [
        migrations.DeleteModel(
            name='Reminders',
        ),
        migrations.DeleteModel(
            name='Shared',
        ),
    ]
