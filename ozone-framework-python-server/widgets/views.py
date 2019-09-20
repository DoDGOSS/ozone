from rest_framework import viewsets
from rest_framework.permissions import IsAdminUser
from django.shortcuts import get_object_or_404
from .models import WidgetDefinition, WidgetType
from .serializers import WidgetDefinitionSerializer, WidgetTypeSerializer


class WidgetDefinitionViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows Widget to be viewed or edited.
    """
    queryset = WidgetDefinition.objects.all()
    serializer_class = WidgetDefinitionSerializer
    permission_classes = (IsAdminUser,)

    def get_object(self):
        queryset = self.get_queryset()

        try:
            filters = {'pk': int(self.kwargs.get('pk'))}
        except ValueError:
            filters = {'universal_name': self.kwargs.get('pk')}

        obj = get_object_or_404(queryset, **filters)
        self.check_object_permissions(self.request, obj)
        return obj

    def perform_create(self, serializer):
        self._adjust_optional_params(serializer)
        serializer.save()

    def perform_update(self, serializer):
        self._adjust_optional_params(serializer)
        serializer.save()

    def _adjust_optional_params(self, serializer):
        request = self.request

        def params_fallback(optional, param):
            if not serializer.validated_data.get(param) and request.data.get(optional):
                serializer.validated_data[param] = request.data.get(optional)

        match_params = [
            ('name', 'display_name'),
            ('headerIcon', 'image_url_small'),
            ('image', 'image_url_medium'),
            ('widgetVersion', 'version'),
            ('url', 'widget_url'),
        ]
        for optional_param, fallback_param in match_params:
            params_fallback(optional_param, fallback_param)


class WidgetTypesViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows widget types to be viewed or edited.
    """
    queryset = WidgetType.objects.all()
    serializer_class = WidgetTypeSerializer
    permission_classes = (IsAdminUser,)
