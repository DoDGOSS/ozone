from rest_framework import permissions
from stacks.models import Stack


class IsStackOwner(permissions.BasePermission):
    def has_permission(self, request, view):
        if request.method in permissions.SAFE_METHODS:
            return True

        stack_id = request.data['stack']
        stack = Stack.objects.get(pk=stack_id)
        return stack.owner == request.user
