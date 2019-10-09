import time
import uuid
from django.db import models
from django.dispatch import receiver
from domain_mappings.models import DomainMapping, MappingType
from intents.models import Intent, IntentDataType, IntentDataTypes


class WidgetDefIntent(models.Model):
    id = models.BigAutoField(primary_key=True)
    version = models.BigIntegerField(default=0)
    receive = models.BooleanField()
    send = models.BooleanField()
    intent = models.ForeignKey(Intent, on_delete=models.CASCADE)
    widget_definition = models.ForeignKey('WidgetDefinition', on_delete=models.CASCADE)

    def __str__(self):
        return f'{self.intent.action} & {self.widget_definition.description}'

    def save(self, *args, **kwargs):
        # Version saver for incrementing as time
        self.version = int(time.time())
        super(WidgetDefIntent, self).save(*args, **kwargs)

    class Meta:
        managed = True
        db_table = 'widget_def_intent'


class WidgetDefIntentDataTypes(models.Model):
    id = models.BigAutoField(primary_key=True)
    intent_data_type = models.ForeignKey(IntentDataType, on_delete=models.CASCADE)
    widget_definition_intent = models.ForeignKey(WidgetDefIntent, on_delete=models.CASCADE)

    class Meta:
        managed = True
        db_table = 'widget_def_intent_data_types'


class WidgetType(models.Model):
    id = models.BigAutoField(primary_key=True)
    version = models.BigIntegerField()
    name = models.CharField(max_length=255)
    display_name = models.CharField(max_length=256)

    def __str__(self):
        return self.name

    def save(self, *args, **kwargs):
        # Version saver for incrementing as time
        self.version = int(time.time())
        super(WidgetType, self).save(*args, **kwargs)

    class Meta:
        managed = True
        db_table = 'widget_type'


class WidgetDefinitionManager(models.Manager):
    def amend_intent(self, item):
        _intents = []
        _data_types = []

        # create intent
        intent, created = Intent.objects.get_or_create(action=item['action'])
        _intents.append((intent, created))

        # create intent data type
        for value in item['dataTypes']:
            data_type, created = IntentDataType.objects.get_or_create(data_type=value)
            _data_types.append((data_type, created))

            # IntentDataTypes Relation
            intent.types.add(data_type)

        return _intents, _data_types

    def handle_intents(self, obj, intents):
        # reset intents for a widget
        obj.widgetdefintent_set.all().delete()

        for key, items in intents.items():
            for item in items:
                # create or update intents
                intents, data_types = self.amend_intent(item)

                # create relations for WidgetDefIntent
                _wdi_list = []
                _keys_map = {"send": "receive", "receive": "send"}

                for intent, _ in intents:
                    params = {
                        str(key): True,
                        str(_keys_map[key]): False,
                        'intent': intent,
                    }
                    wdi, _ = obj.widgetdefintent_set.get_or_create(**params)
                    _wdi_list.append(wdi)

                # create relations for WidgetDefIntentDataTypes
                for wdi in _wdi_list:
                    for data_type, _ in data_types:
                        data = {
                            'widget_definition_intent': wdi
                        }
                        data_type.widgetdefintentdatatypes_set.get_or_create(**data)

    def create(self, **kwargs):
        intents = kwargs.pop('intents', {})
        obj = super().create(**kwargs)

        if intents:
            self.handle_intents(obj, intents)

        return obj


class WidgetDefinition(models.Model):
    id = models.BigAutoField(primary_key=True)
    version = models.BigIntegerField(default=0)
    visible = models.BooleanField()
    image_url_medium = models.CharField(max_length=2083)
    image_url_small = models.CharField(max_length=2083)
    singleton = models.BooleanField(default=False)
    width = models.IntegerField()
    widget_version = models.CharField(max_length=2083, blank=True, null=True)
    height = models.IntegerField()
    widget_url = models.CharField(max_length=2083)
    widget_guid = models.CharField(unique=True, max_length=255, default=uuid.uuid4)
    display_name = models.CharField(max_length=256, blank=True)
    background = models.BooleanField(blank=True, null=True)
    universal_name = models.CharField(unique=True, max_length=255, blank=True, null=True)
    descriptor_url = models.CharField(max_length=2083, blank=True, null=True)
    description = models.CharField(max_length=4000, blank=True, null=True)
    mobile_ready = models.BooleanField(default=False)
    types = models.ManyToManyField('WidgetType', through='WidgetDefinitionWidgetTypes', related_name='widgets')

    objects = WidgetDefinitionManager()

    def __str__(self):
        return self.display_name

    def save(self, *args, **kwargs):
        # Version saver for incrementing as time
        self.version = int(time.time())
        super(WidgetDefinition, self).save(*args, **kwargs)

    class Meta:
        managed = True
        db_table = 'widget_definition'


@receiver(models.signals.pre_delete, sender=WidgetDefinition)
def cleanup(sender, instance, *args, **kwargs):
    from people.models import Person, PersonWidgetDefinition
    DomainMapping.objects.filter(src_id=instance.id, src_type=MappingType.widget)
    DomainMapping.objects.filter(dest_id=instance.id, dest_type=MappingType.widget)

    users_assigned_to_widget = PersonWidgetDefinition.objects.filter(
        widget_definition=instance
    ).values("person")
    Person.objects.filter(pk__in=users_assigned_to_widget).update(requires_sync=True)


class WidgetDefinitionWidgetTypes(models.Model):
    id = models.BigAutoField(primary_key=True)
    widget_definition = models.OneToOneField(WidgetDefinition, on_delete=models.CASCADE)
    widget_type = models.ForeignKey('WidgetType', on_delete=models.CASCADE)

    class Meta:
        managed = True
        db_table = 'widget_definition_widget_types'
        unique_together = (('widget_definition', 'widget_type'),)
