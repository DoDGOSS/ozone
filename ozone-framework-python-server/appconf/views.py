from rest_framework import viewsets
from rest_framework.permissions import IsAdminUser
from .models import ApplicationConfiguration
from .serializers import AppConfSerializer


class AppConfViewSet(viewsets.ModelViewSet):
    """
    API endpoint AppConf
    """
    queryset = ApplicationConfiguration.objects.all()
    serializer_class = AppConfSerializer
    permission_classes = (IsAdminUser,)
