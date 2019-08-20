from rest_framework import serializers
from .models import Dashboard
from people.serializers import PersonBaseSerializer
from stacks.serializers import StackDashboardSerializer


class DashBoardSerializer(serializers.ModelSerializer):
    user = PersonBaseSerializer(many=False)
    created_by = PersonBaseSerializer(many=False)
    edited_by = PersonBaseSerializer(many=False)
    stack = StackDashboardSerializer(many=False)

    class Meta:
        model = Dashboard
        fields = '__all__'


class GeneralDashboardSerializer(serializers.ModelSerializer):
    class Meta:
        model = Dashboard
        fields = '__all__'
