from rest_framework import serializers
from .models import Stack


class StackSerializer(serializers.ModelSerializer):
    class Meta:
        model = Stack
        exclude = ('default_group', )
        read_only_fields = ('version', 'stack_context', 'owner')
        extra_kwargs = {'name': {'required': True}}

    def create(self, validated_data):
        request = self.context.get("request")
        newStack = Stack.create(request.user, validated_data)

        return newStack


class StackIdSerializer(serializers.Serializer):
    stack = serializers.PrimaryKeyRelatedField(many=False, read_only=False, queryset=Stack.objects.all())

    class Meta:
        fields = ('stack', )


class StackDashboardSerializer(serializers.ModelSerializer):
    class Meta:
        model = Stack
        fields = '__all__'
