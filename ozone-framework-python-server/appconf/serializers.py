from django.utils import timezone
import traceback
from rest_framework import serializers
from rest_framework.serializers import raise_errors_on_nested_writes
from rest_framework.utils import model_meta
import fileinput
from people.serializers import PersonBaseSerializer
from .models import ApplicationConfiguration


class AppConfSerializer(serializers.ModelSerializer):
    created_by = PersonBaseSerializer(many=False, read_only=True)
    edited_by = PersonBaseSerializer(many=False, read_only=True)

    class Meta:
        model = ApplicationConfiguration
        fields = '__all__'

    def create(self, validated_data):
        validated_data['created_by'] = self.context['request'].user
        return super(AppConfSerializer, self).create(validated_data)

    def update(self, instance, validated_data):
        if instance.code == 'owf.cef.log.location':
            with fileinput.FileInput('.env', inplace=True, backup='.bak') as file:
                for line in file:
                    print(line.replace(f'CEF_LOCATION={instance.value}', f'CEF_LOCATION={validated_data["value"]}'),
                          end='')
        if instance.code == 'owf.inactivity.threshold':
            with fileinput.FileInput('.env', inplace=True, backup='.bak') as file:
                for line in file:
                    print(line.replace(f'SESSION_INACTIVITY_THRESHOLD={instance.value}',
                                       f'SESSION_INACTIVITY_THRESHOLD={validated_data["value"]}'),
                          end='')
        validated_data['edited_by'] = self.context['request'].user
        validated_data['edited_date'] = timezone.localdate()
        return super(AppConfSerializer, self).update(instance, validated_data)
