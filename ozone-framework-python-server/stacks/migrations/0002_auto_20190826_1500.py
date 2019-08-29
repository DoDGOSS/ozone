# Generated by Django 2.2.1 on 2019-08-26 22:00

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('stacks', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='stack',
            name='default_group',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, to='owf_groups.OwfGroup'),
        ),
        migrations.AlterField(
            model_name='stack',
            name='owner',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, to=settings.AUTH_USER_MODEL),
        ),
        migrations.AlterField(
            model_name='stackgroups',
            name='group',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='owf_groups.OwfGroup'),
        ),
        migrations.AlterField(
            model_name='stackgroups',
            name='stack',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='stacks.Stack'),
        ),
    ]