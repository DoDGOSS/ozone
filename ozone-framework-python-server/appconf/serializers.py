from rest_framework import serializers
from .models import ApplicationConfiguration


class AppConfSerializer(serializers.ModelSerializer):

    class Meta:
        model = ApplicationConfiguration
        fields = '__all__'
