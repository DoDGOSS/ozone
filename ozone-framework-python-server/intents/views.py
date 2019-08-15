from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from .models import IntentDataType, Intent, IntentDataTypes
from .serializers import IntentSerializer, IntentDataTypeSerializer, IntentDataTypesSerializer


class IntentViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows dashboards to be viewed or edited.
    """
    queryset = Intent.objects.all()
    serializer_class = IntentSerializer
    permission_classes = (IsAuthenticated,)


class IntentDataTypesViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows dashboards to be viewed or edited.
    """
    queryset = IntentDataTypes.objects.all()
    serializer_class = IntentDataTypesSerializer
    permission_classes = (IsAuthenticated,)


class IntentDataTypeViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows dashboards to be viewed or edited.
    """
    queryset = IntentDataType.objects.all()
    serializer_class = IntentDataTypeSerializer
    permission_classes = (IsAuthenticated,)
