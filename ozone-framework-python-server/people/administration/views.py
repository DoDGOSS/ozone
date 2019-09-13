from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import viewsets
from rest_framework.permissions import IsAdminUser
from people.models import Person
from .serializers import AdministrationOfUserSerializer, AdministrationOfUserSerializerFull


class AdministrationOfUserAPIView(viewsets.ModelViewSet):
    queryset = Person.objects.all()
    permission_classes = (IsAdminUser,)
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['username']

    def get_serializer_class(self):
        if self.action == 'create':
            return AdministrationOfUserSerializer
        else:
            return AdministrationOfUserSerializerFull
