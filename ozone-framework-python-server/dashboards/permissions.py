from rest_framework import permissions
from stacks.models import Stack


class IsStackOwner(permissions.BasePermission):
    def has_permission(self, request, view):
        if request.method != "POST":
            return True

        stack_id = request.data['stack']
        stack = Stack.objects.get(pk=stack_id)
        return stack.owner == request.user

    def has_object_permission(self, request, view, obj):
        return obj.stack.owner == request.user
