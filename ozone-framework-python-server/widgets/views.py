from rest_framework import viewsets
from rest_framework.permissions import IsAdminUser
from .models import WidgetDefinition, WidgetType
from .serializers import WidgetDefinitionSerializer, WidgetTypeSerializer


class WidgetDefinitionViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows Widget to be viewed or edited.
    """
    queryset = WidgetDefinition.objects.all()
    serializer_class = WidgetDefinitionSerializer
    permission_classes = (IsAdminUser,)


class WidgetTypesViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows widget types to be viewed or edited.
    """
    queryset = WidgetType.objects.all()
    serializer_class = WidgetTypeSerializer
    permission_classes = (IsAdminUser,)
