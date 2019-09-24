from rest_framework import serializers
from .models import Dashboard
from people.serializers import PersonBaseSerializer
from stacks.serializers import StackBaseSerializer
from stacks.models import Stack


class DashBoardSerializer(serializers.ModelSerializer):
    user = PersonBaseSerializer(many=False)
    created_by = PersonBaseSerializer(many=False)
    edited_by = PersonBaseSerializer(many=False)
    stack = StackBaseSerializer(many=False)

    class Meta:
        model = Dashboard
        fields = '__all__'


class DashboardBaseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Dashboard
        fields = '__all__'

    def create(self, validated_data):
        request = self.context.get("request")
        stack = validated_data['stack']
        del validated_data['stack']
        new_user_dashboard = stack.add_dashboard(request.user, validated_data)

        return new_user_dashboard
