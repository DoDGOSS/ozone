from rest_framework import viewsets
from .models import Stack
from .serializers import StackSerializer
from rest_framework.permissions import IsAuthenticated, IsAdminUser


class StackViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows stacks to be viewed or edited.
    """
    queryset = Stack.objects.all()
    permission_classes = (IsAuthenticated,)
    serializer_class = StackSerializer
