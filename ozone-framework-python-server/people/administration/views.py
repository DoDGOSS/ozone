from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import viewsets
from rest_framework.permissions import IsAdminUser
from people.models import Person
from .serializers import AdministrationOfUserSerializer, AdministrationOfUserSerializerFull
from rest_framework.response import Response
from rest_framework import status


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

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        can_delete = self.perform_destroy(instance)
        if can_delete:
            return Response(status=status.HTTP_204_NO_CONTENT)
        else:
            return Response(status=status.HTTP_409_CONFLICT)

    def perform_destroy(self, instance):
        # stop user from deleting its self
        if self.request.user.id is instance.id:
            return False
        # stop the deletion of a super user or the person who was first in the system
        if self.request.user.is_admin and instance.id is 1:
            return False
        # deletes a user that is not self or the super
        else:
            instance.delete()
            return True
