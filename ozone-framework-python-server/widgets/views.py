from rest_framework import viewsets
# from rest_framework.permissions import IsAuthenticated, IsAdminUser
from .models import WidgetDefinition
from .serializers import WidgetDefinitionSerializer


class WidgetDefinitionViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows people to be viewed or edited.
    """
    queryset = WidgetDefinition.objects.all()
    serializer_class = WidgetDefinitionSerializer



