# Generated by Django 2.2.1 on 2019-08-27 20:43

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('stacks', '0002_auto_20190826_1500'),
    ]

    operations = [
        migrations.AlterField(
            model_name='stack',
            name='unique_widget_count',
            field=models.BigIntegerField(blank=True, default=0, null=True),
        ),
        migrations.AlterField(
            model_name='stack',
            name='version',
            field=models.BigIntegerField(default=0),
        ),
    ]