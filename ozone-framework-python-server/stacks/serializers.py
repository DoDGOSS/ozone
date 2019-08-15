from rest_framework import serializers
from .models import Stack


class StackSerializer(serializers.ModelSerializer):
    class Meta:
        model = Stack
        exclude = ('default_group', )


class StackIdSerializer(serializers.Serializer):
    stack = serializers.PrimaryKeyRelatedField(many=False, read_only=False, queryset=Stack.objects.all())

    class Meta:
        fields = ('stack', )


class StackDashboardSerializer(serializers.ModelSerializer):
    class Meta:
        model = Stack
        fields = '__all__'
