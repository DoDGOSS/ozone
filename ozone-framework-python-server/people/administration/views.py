from rest_framework import viewsets
from rest_framework.permissions import IsAdminUser
from people.models import Person
from .serializers import AdministrationOfUserSerializer


class AdministrationOfUserAPIView(viewsets.ModelViewSet):
    queryset = Person.objects.all()
    serializer_class = AdministrationOfUserSerializer
    permission_classes = (IsAdminUser,)
