from rest_framework import viewsets
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework.response import Response
from rest_framework import status
from django.utils.translation import ugettext_lazy as _
from django_filters.rest_framework import DjangoFilterBackend
from config.owf_mixins import mixins
from owf_groups.models import OwfGroup
from stacks.models import Stack
from stacks.serializers import StackBaseSerializer
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


class PersonStackViewset(APIView):
    """
    API endpoint that allows you to get all stacks assigned to a user.
    """
    permission_classes = (IsAdminUser,)
    default_error_messages = {
        'object_404': _('Object not found for {0}')
    }

    def get(self, request, format=None):

        person_id = request.query_params.get('person', None)

        if person_id is None:
            return Response({'Error': 'Needs Parameter: person'},
                            status=status.HTTP_400_BAD_REQUEST)

        else:
            person = Person.objects.filter(id=person_id).first()
            if person:
                stacks = person.get_directly_assigned_stacks()
                serialize_person = PersonBaseSerializer(person)
                stack_serializer = StackBaseSerializer(stacks, many=True)

                return Response({'user': serialize_person.data,
                                 'stacks': stack_serializer.data})

            else:
                return Response({'Error': 'Person Does Not Exist'},
                                status=status.HTTP_400_BAD_REQUEST)
