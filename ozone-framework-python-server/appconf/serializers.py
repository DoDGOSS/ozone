from django.utils import timezone
import traceback
from rest_framework import serializers
from rest_framework.serializers import raise_errors_on_nested_writes
from rest_framework.utils import model_meta

from .models import ApplicationConfiguration


class AppConfSerializer(serializers.ModelSerializer):

    class Meta:
        model = ApplicationConfiguration
        fields = '__all__'

    def create(self, validated_data):
        validated_data['created_by'] = self.context['request'].user
        return super(AppConfSerializer, self).create(validated_data)

    def update(self, instance, validated_data):
        validated_data['edited_by'] = self.context['request'].user
        validated_data['edited_date'] = timezone.localdate()
        return super(AppConfSerializer, self).update(instance, validated_data)
