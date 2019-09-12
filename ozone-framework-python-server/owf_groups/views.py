from rest_framework import viewsets
from rest_framework.permissions import IsAdminUser
from django_filters.rest_framework import DjangoFilterBackend
from .models import OwfGroup, OwfGroupPeople
from .serializers import OWFGroupBaseSerializer, OWFGroupPeopleSerializer


class OWFGroupViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows owf groups to be viewed or edited.
    """
    queryset = OwfGroup.objects.filter(stack_default=False)
    serializer_class = OWFGroupBaseSerializer
    permission_classes = (IsAdminUser,)
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['name']


class OWFGroupPeopleViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows owf groups to be viewed or edited.
    """
    queryset = OwfGroupPeople.objects.all()
    serializer_class = OWFGroupPeopleSerializer
    permission_classes = (IsAdminUser,)
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['group', 'person']
