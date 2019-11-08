import json
from rest_framework import serializers
from widgets.serializers import WidgetDefinitionSerializer
from .models import Person, PersonWidgetDefinition
from django.core import serializers as _serializers


class PersonBaseSerializer(serializers.ModelSerializer):
    def to_representation(self, instance):
        ret = super().to_representation(instance)

        groups_object_to_modify = [item for item in instance.groups.all().values()]
        for item in groups_object_to_modify:
            item['status'] = item['status'].value
        json_groups = json.dumps([dict(item) for item in groups_object_to_modify])

        extra_ret = {
            'groups': json.loads(json_groups),
            'roles': [],
            'theme': '',
        }
        ret.update(extra_ret)
        return ret

    class Meta:
        model = Person
        exclude = ('password',)


class PersonThinSerializer(serializers.ModelSerializer):
    class Meta:
        model = Person
        fields = ('id', 'username', 'email')


class PersonWidgetDefinitionBaseSerializer(serializers.ModelSerializer):
    class Meta:
        model = PersonWidgetDefinition
        fields = '__all__'
        extra_kwargs = {
            'person': {'required': True},
            'widget_definition': {'required': True}
        }


class PersonWidgetDefinitionSerializer(serializers.ModelSerializer):
    person = PersonBaseSerializer()
    widget_definition = WidgetDefinitionSerializer()

    class Meta:
        model = PersonWidgetDefinition
        fields = '__all__'
        extra_kwargs = {
            'person': {'required': True},
            'widget_definition': {'required': True}
        }
