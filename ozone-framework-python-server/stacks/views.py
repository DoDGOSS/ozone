from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from django_filters.rest_framework import DjangoFilterBackend
from .models import Stack, StackGroups
from .serializers import StackSerializer, StackGroupsSerializer, StackGroupsSerializerList


class StackViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows stacks to be viewed or edited.
    """
    # TODO - Should we filter this or return all as legacy did
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
    permission_classes = (IsAdminUser,)
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['stack', 'group']

    def get_serializer_class(self):
        if self.action == 'list':
            return StackGroupsSerializerList
        else:
            return StackGroupsSerializer
