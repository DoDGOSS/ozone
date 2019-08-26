from rest_framework.permissions import IsAuthenticated
from .models import Person
from rest_framework.views import APIView
from .serializers import PersonBaseSerializer
from rest_framework.response import Response


class PersonDetailView(APIView):

    permission_classes = (IsAuthenticated,)

    def get(self, request):
        """
        Return the details of the currently logged in user matching the legacy api
        """
        user = Person.objects.get(email=request.user.email)
        serializer = PersonBaseSerializer(user)
        return Response(serializer.data)

