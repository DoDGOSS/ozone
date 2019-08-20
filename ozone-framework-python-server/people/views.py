from rest_framework import viewsets, mixins
from rest_framework.permissions import IsAuthenticated, IsAdminUser
# from rest_framework_extensions.mixins import NestedViewSetMixin
# TODO: Groups with Default group per stack for Person to stack functionality.
# from stacks.serializers import StackIdSerializer
# TODO: Groups with Default group per stack for Person to stack functionality.
from .models import Person
from rest_framework.views import APIView
from .serializers import PersonBaseSerializer
from rest_framework.response import Response


class PersonDetailView(APIView):

    def get(self, request):
        """
        Return the details of the currently logged in user matching the legacy api
        """
        user = Person.objects.get(email=request.user.email)
        serializer = PersonBaseSerializer(user)
        return Response(serializer.data)


class PersonViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows people to be viewed or edited.
    """
    queryset = Person.objects.all()
    serializer_class = PersonBaseSerializer

    def get_permissions(self):
        """
        Instantiates and returns the list of permissions that this view requires.
        """
        if self.action == 'destroy':
            permission_classes = [IsAuthenticated]
        else:
            permission_classes = [IsAdminUser]
        return [permission() for permission in permission_classes]


# TODO: Groups with Default group per stack for Person to stack functionality.
#
# class PersonStackViewSet(NestedViewSetMixin, mixins.CreateModelMixin, viewsets.GenericViewSet):
#     """
#     API endpoint that allows a person's stacks to be edited.
#     """
#     queryset = Person.objects.all()
#     serializer_class = StackIdSerializer
#
#     def perform_create(self, serializer):
#         stack = serializer.validated_data['stack']
#         if stack is not None and stack.default_group is not None:
#             stack.default_group.people.add(self.get_object())
#             stack.default_group.save()
