import uuid
from django.core.exceptions import ValidationError
from django.http import Http404
from rest_framework import status, viewsets
from rest_framework.response import Response
from owf_groups.models import OwfGroup
from .models import Stack
from .serializers import StackSerializer, StackIdSerializer
from rest_framework.permissions import IsAuthenticated, IsAdminUser


class StackViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows stacks to be viewed or edited.
    """
    queryset = Stack.objects.all()
    serializer_class = StackSerializer

    def get_permissions(self):
        """
        Instantiates and returns the list of permissions that this view requires.
        """
        if self.action == 'create':
            permission_classes = [IsAdminUser]
        else:
            permission_classes = [IsAuthenticated]
        return [permission() for permission in permission_classes]
