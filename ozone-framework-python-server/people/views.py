from rest_framework import viewsets
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from config.owf_mixins import mixins
from .models import Person, PersonWidgetDefinition
from .serializers import PersonBaseSerializer, PersonWidgetDefinitionSerializer, PersonWidgetDefinitionBaseSerializer


class PersonDetailView(APIView):
    permission_classes = (IsAuthenticated,)

    def get(self, request):
        """
        Return the details of the currently logged in user matching the legacy api
        """
        user = Person.objects.get(email=request.user.email)
        serializer = PersonBaseSerializer(user)
        return Response(serializer.data)


class PersonWidgetDefinitionViewSet(mixins.BulkDestroyModelMixin, viewsets.ModelViewSet):
    """
    API endpoint that allows users-widgets to be viewed or edited.
    """
    permission_classes = (IsAdminUser,)
    queryset = PersonWidgetDefinition.objects.all()
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['widget_definition', 'person']

    def get_serializer_class(self):
        if self.request.method == 'POST':
            return PersonWidgetDefinitionBaseSerializer
        elif self.request.method == 'PUT':
            return PersonWidgetDefinitionBaseSerializer
        else:
            return PersonWidgetDefinitionSerializer
