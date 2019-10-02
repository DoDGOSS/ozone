import time
from django.db import models


class Intent(models.Model):
    id = models.BigAutoField(primary_key=True)
    version = models.BigIntegerField(default=0)
    action = models.CharField(unique=True, max_length=255)

    types = models.ManyToManyField('IntentDataType', through='IntentDataTypes', related_name='intents')

    def __str__(self):
        return self.action

    def save(self, *args, **kwargs):
        # Version saver for incrementing as time
        self.version = int(time.time())
        super(Intent, self).save(*args, **kwargs)

    class Meta:
        managed = True
        db_table = 'intent'


class IntentDataType(models.Model):
    id = models.BigAutoField(primary_key=True)
    version = models.BigIntegerField(default=0)
    data_type = models.CharField(max_length=255)

    def __str__(self):
        return self.data_type

    def save(self, *args, **kwargs):
        # Version saver for incrementing as time
        self.version = int(time.time())
        super(IntentDataType, self).save(*args, **kwargs)

    class Meta:
        managed = True
        db_table = 'intent_data_type'


class IntentDataTypes(models.Model):
    id = models.BigAutoField(primary_key=True)
    intent_data_type = models.ForeignKey(IntentDataType, on_delete=models.CASCADE)
    intent = models.ForeignKey(Intent, on_delete=models.CASCADE)

    def __str__(self):
        return f'data type = {self.intent_data_type.data_type} & intent = {self.intent.action}'

    class Meta:
        managed = True
        db_table = 'intent_data_types'
