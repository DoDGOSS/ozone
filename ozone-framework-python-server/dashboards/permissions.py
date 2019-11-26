from rest_framework import permissions
from stacks.models import Stack


class IsStackOwner(permissions.BasePermission):
    def has_permission(self, request, view):
        if request.method != "POST" or view.action == "share":
            return True

        try:
            stack_id = request.data['stack']
            stack = Stack.objects.get(pk=stack_id)
            return stack.owner == request.user

        except Exception:
            return True

    def has_object_permission(self, request, view, obj):
        if request.method != "POST" or view.action == "share":
            return True

        return obj.stack.owner == request.user
