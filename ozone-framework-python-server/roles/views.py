from rest_framework import viewsets
from rest_framework.permissions import IsAdminUser
from .models import Role
from .serializers import RoleSerializer


class RolesViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows dashboards to be viewed or edited.
    """
    queryset = Role.objects.all()
    serializer_class = RoleSerializer
    permission_classes = (IsAdminUser,)
