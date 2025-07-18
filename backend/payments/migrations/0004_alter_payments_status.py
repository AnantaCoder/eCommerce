# Generated by Django 5.2.1 on 2025-07-08 14:45

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('payments', '0003_alter_payments_status'),
    ]

    operations = [
        migrations.AlterField(
            model_name='payments',
            name='status',
            field=models.CharField(choices=[('pending', 'Pending'), ('completed', 'Completed'), ('failed', 'Failed'), ('refunded', 'Refunded')], default='pending', max_length=20),
        ),
    ]
