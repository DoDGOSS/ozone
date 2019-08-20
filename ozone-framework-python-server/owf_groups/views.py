from rest_framework import viewsets
from rest_framework.permissions import IsAdminUser
from .models import OwfGroup, OwfGroupPeople
from .serializers import OWFGroupBaseSerializer, OWFGroupPeopleSerializer


class OWFGroupViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows owf groups to be viewed or edited.
    """
    queryset = OwfGroup.objects.all()
    serializer_class = OWFGroupBaseSerializer
    permission_classes = (IsAdminUser,)


class OWFGroupPeopleViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows owf groups to be viewed or edited.
    """
    queryset = OwfGroupPeople.objects.all()
    serializer_class = OWFGroupPeopleSerializer
    permission_classes = (IsAdminUser,)




