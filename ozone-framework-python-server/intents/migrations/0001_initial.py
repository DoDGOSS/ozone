# Generated by Django 2.2.1 on 2019-08-15 21:29

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Intent',
            fields=[
                ('id', models.BigAutoField(primary_key=True, serialize=False)),
                ('version', models.BigIntegerField()),
                ('action', models.CharField(max_length=255, unique=True)),
            ],
            options={
                'db_table': 'intent',
                'managed': True,
            },
        ),
        migrations.CreateModel(
            name='IntentDataType',
            fields=[
                ('id', models.BigAutoField(primary_key=True, serialize=False)),
                ('version', models.BigIntegerField()),
                ('data_type', models.CharField(max_length=255)),
            ],
            options={
                'db_table': 'intent_data_type',
                'managed': True,
            },
        ),
        migrations.CreateModel(
            name='IntentDataTypes',
            fields=[
                ('id', models.BigAutoField(primary_key=True, serialize=False)),
                ('intent', models.ForeignKey(on_delete=django.db.models.deletion.DO_NOTHING, to='intents.Intent')),
                ('intent_data_type', models.ForeignKey(on_delete=django.db.models.deletion.DO_NOTHING, to='intents.IntentDataType')),
            ],
            options={
                'db_table': 'intent_data_types',
                'managed': True,
            },
        ),
    ]