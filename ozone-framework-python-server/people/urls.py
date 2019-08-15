from django.urls import path
from people.views import PersonDetailView
from .views import PersonViewSet
from rest_framework import routers


router = routers.SimpleRouter()
router.register(r'people', PersonViewSet)

urlpatterns = [
    path('me/whoami', PersonDetailView.as_view(), name='person-detail'),
]

urlpatterns += router.urls
