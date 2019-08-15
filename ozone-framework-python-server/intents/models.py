from django.db import models


class Intent(models.Model):
    id = models.BigAutoField(primary_key=True)
    version = models.BigIntegerField()
    action = models.CharField(unique=True, max_length=255)

    def __str__(self):
        return self.action

    class Meta:
        managed = True
        db_table = 'intent'


class IntentDataType(models.Model):
    id = models.BigAutoField(primary_key=True)
    version = models.BigIntegerField()
    data_type = models.CharField(max_length=255)

    def __str__(self):
        return self.data_type

    class Meta:
        managed = True
        db_table = 'intent_data_type'


class IntentDataTypes(models.Model):
    id = models.BigAutoField(primary_key=True)
    intent_data_type = models.ForeignKey(IntentDataType, models.DO_NOTHING)
    intent = models.ForeignKey(Intent, models.DO_NOTHING)

    def __str__(self):
        return f'data type = {self.intent_data_type.data_type} & intent = {self.intent.action}'

    class Meta:
        managed = True
        db_table = 'intent_data_types'
