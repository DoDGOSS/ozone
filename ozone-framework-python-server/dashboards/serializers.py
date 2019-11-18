from rest_framework import serializers
from .models import Dashboard
from people.serializers import PersonBaseSerializer
from stacks.serializers import StackSerializer
from stacks.models import Stack
import json


class DashboardBaseSerializer(serializers.ModelSerializer):
    stack = StackSerializer(many=False, required=False)
    stack_id = serializers.IntegerField(required=False)
    user = PersonBaseSerializer(many=False, required=False, read_only=True)
    created_by = PersonBaseSerializer(many=False, required=False, read_only=True)
    edited_by = PersonBaseSerializer(many=False, required=False, read_only=True)
    layout_config = serializers.JSONField()

    def to_representation(self, instance):
        ret = super().to_representation(instance)

        if ret['layout_config']:
            ret['layout_config'] = json.dumps(ret['layout_config'])
        else:
            ret['layout_config'] = '{"backgroundWidgets": [], "panels": [], "tree": null}'

        # UI Expectation
        expectation = {
            'isGroupDashboard': False,
            'disabled': False,
            'originalName': ret['name'],
        }

        ret.update(expectation)
        return ret

    class Meta:
        model = Dashboard
        fields = '__all__'
        read_only_fields = ('created_by', 'edited_by', 'user')

    def update(self, instance, validated_data):
        stack = validated_data.pop('stack', None)
        stack_id = validated_data.pop('stack_id', None)
        validated_data['layout_config'] = json.dumps(validated_data['layout_config'])

        super().update(instance, validated_data)
        return instance

    def create(self, validated_data):
        # TODO: this should be cleaned up. creating a dashboard should never create a stack.
        request = self.context.get("request")

        stack = validated_data.pop('stack', None)
        stack_id = validated_data.pop('stack_id', None)
        validated_data['layout_config'] = json.dumps(validated_data['layout_config'])

        if stack_id:
            stack = Stack.objects.get(pk=stack_id)
            _, new_user_dashboard = stack.add_dashboard(request.user, validated_data)
            return new_user_dashboard
        else:
            dashboard = Dashboard.objects.get(stack=stack.id, user=request.user)
            return dashboard
