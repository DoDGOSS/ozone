from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from django_filters.rest_framework import DjangoFilterBackend
from .models import Stack, StackGroups
from .serializers import StackSerializer, StackGroupsSerializer


class StackViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows stacks to be viewed or edited.
    """
    queryset = Stack.objects.all()
    permission_classes = (IsAuthenticated,)
    serializer_class = StackSerializer


class StackAdminViewSet(viewsets.ModelViewSet):
    queryset = Stack.objects.all()
    serializer_class = StackSerializer
    permission_classes = (IsAdminUser,)
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['name', ]


class StackGroupsViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows stack groups to be viewed or edited
    """
    queryset = StackGroups.objects.all()
    serializer_class = StackGroupsSerializer
    permission_classes = (IsAdminUser,)
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['stack', 'group']
