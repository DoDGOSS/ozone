from rest_framework import serializers
from .models import Person, PersonWidgetDefinition


class PersonBaseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Person
        exclude = ('password',)


class PersonThinSerializer(serializers.ModelSerializer):
    class Meta:
        model = Person
        fields = ('id', 'username', 'email')


class PersonWidgetDefinitionSerializer(serializers.ModelSerializer):
    class Meta:
        model = PersonWidgetDefinition
        fields = '__all__'
        extra_kwargs = {
            'person': {'required': True},
            'widget_definition': {'required': True}
        }
