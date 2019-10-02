from rest_framework import serializers
from .models import ApplicationConfiguration


class AppConfSerializer(serializers.ModelSerializer):

    class Meta:
        model = ApplicationConfiguration
        fields = '__all__'

        # def create(self, validated_data):
        #     request = self.context.get("request")
        #     new_stack = ApplicationConfiguration.create(request.user, validated_data)
        #
        #     return new_stack
