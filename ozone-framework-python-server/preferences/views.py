from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated, IsAdminUser

from .models import Preference
from .serializer import PreferenceSerializer


class PreferenceUserViewSet(viewsets.ModelViewSet):
    serializer_class = PreferenceSerializer
    permission_classes = (IsAuthenticated,)
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['namespace', 'path', 'user']

    def get_queryset(self):
        return Preference.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        return serializer.save(user_id=self.request.user.id)


class PreferenceAdminViewSet(viewsets.ModelViewSet):
    queryset = Preference.objects.all()
    serializer_class = PreferenceSerializer
    permission_classes = (IsAdminUser,)
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['namespace', 'path', 'user']

    def perform_create(self, serializer):
        user_id = serializer.validated_data.pop('user_id', self.request.user.id)
        return serializer.save(user_id=user_id)
