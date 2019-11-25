from rest_framework import viewsets, mixins
from rest_framework.permissions import IsAdminUser, IsAuthenticated
from .models import ApplicationConfiguration
from .serializers import AppConfSerializer


class AppConfAdminViewSet(viewsets.ModelViewSet):
    """
    API endpoint AppConf
    """
    queryset = ApplicationConfiguration.objects.all()
    serializer_class = AppConfSerializer
    permission_classes = (IsAdminUser,)


class AppConfViewSet(mixins.ListModelMixin, viewsets.GenericViewSet):
    """
    API endpoint AppConf
    """
    # TODO: write tests for this endpoint
    queryset = ApplicationConfiguration.objects.all()
    serializer_class = AppConfSerializer
    permission_classes = (IsAuthenticated,)
