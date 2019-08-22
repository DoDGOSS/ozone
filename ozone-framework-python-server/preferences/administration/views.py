from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import viewsets
from rest_framework.permissions import IsAdminUser
from preferences.models import Preference
from preferences.serializer import PreferenceSerializer


class PreferenceAdminViewSet(viewsets.ModelViewSet):

    queryset = Preference.objects.all()
    serializer_class = PreferenceSerializer
    permission_classes = (IsAdminUser,)
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['namespace', 'path', 'user']
