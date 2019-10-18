from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.permissions import IsAdminUser
from rest_framework.renderers import TemplateHTMLRenderer
from django_filters.rest_framework import DjangoFilterBackend
from django.shortcuts import get_object_or_404
from .models import WidgetDefinition, WidgetDefIntent, WidgetType
from .serializers import WidgetDefinitionSerializer, WidgetTypeSerializer
from rest_framework.response import Response
from rest_framework import status
from drf_yasg.inspectors import SwaggerAutoSchema
from drf_yasg.utils import swagger_auto_schema
import json
from collections import defaultdict


class WidgetDefinitionViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows Widget to be viewed or edited.
    """
    queryset = WidgetDefinition.objects.all()
    serializer_class = WidgetDefinitionSerializer
    permission_classes = (IsAdminUser,)
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['universal_name', ]

    def perform_create(self, serializer):
        self._adjust_optional_params(serializer)
        serializer.save()

    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)
        instance = self.get_object()

        data = request.data.copy()
        intents = data.pop('intents', {})
        if intents:
            WidgetDefinition.objects.handle_intents(instance, intents)

        serializer = self.get_serializer(instance, data=data, partial=partial)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        self.perform_update(serializer)
        response = {'intents': intents}
        response.update(serializer.data)

        if getattr(instance, '_prefetched_objects_cache', None):
            # If 'prefetch_related' has been applied to a queryset, we need to
            # forcibly invalidate the prefetch cache on the instance.
            instance._prefetched_objects_cache = {}

        return Response(response)

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


class HTMLSchema(SwaggerAutoSchema):
    def get_produces(self):
        return ['text/html']


class WidgetViewSet(viewsets.GenericViewSet):
    queryset = WidgetDefinition.objects.all()
    lookup_field = 'widget_guid'
    serializer_class = WidgetDefinitionSerializer

    @action(methods=['get'], detail=True, permission_classes=(IsAdminUser,), renderer_classes=[TemplateHTMLRenderer])
    @swagger_auto_schema(auto_schema=HTMLSchema, responses={'200': 'Descriptor exported as HTML'})
    def export(self, request, widget_guid=None):
        widget = self.get_object()
        descriptor = self._generate_descriptor_dict(widget)
        return Response(
            {'descriptor': json.dumps(descriptor)},
            template_name='empty_descriptor.html'
        )

    def _generate_descriptor_dict(self, widget):
        descriptor = {}

        descriptor['name'] = widget.display_name
        descriptor['widgetUrl'] = widget.widget_url
        descriptor['imageUrlSmall'] = widget.image_url_small
        descriptor['imageUrlMedium'] = widget.image_url_medium
        descriptor['width'] = widget.width
        descriptor['height'] = widget.height
        descriptor['visible'] = widget.visible
        descriptor['singleton'] = widget.singleton
        descriptor['background'] = widget.background
        descriptor['widgetTypes'] = list(
            filter(lambda x: x is not None, [getattr(widget_type, 'name', None) for widget_type in widget.types.all()])
        )

        descriptor['mobileReady'] = widget.mobile_ready if widget.mobile_ready is not None else False

        # Non-required fields
        if widget.descriptor_url:
            descriptor['descriptorUrl'] = widget.descriptor_url
        if widget.universal_name:
            descriptor['universalName'] = widget.universal_name
        if widget.description:
            descriptor['description'] = widget.description
        if widget.widget_version:
            descriptor['widgetVersion'] = widget.widget_version

        # Intents
        intents = defaultdict(list)
        for intent in WidgetDefIntent.objects.filter(widget_definition=widget).all():
            obj = {
                'action': intent.intent.action,
                'dataTypes': [intent_type.data_type for intent_type in intent.intent.types.all()]
            }
            if intent.send:
                intents['send'].append(obj)
            if intent.receive:
                intents['receive'].append(obj)

        if intents:
            descriptor['intents'] = intents

        return descriptor
