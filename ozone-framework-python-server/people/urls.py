from django.urls import path
from people.views import PersonDetailView
from rest_framework import routers
from .administration.views import AdministrationOfUserAPIView


router = routers.SimpleRouter()
router.register(r'admin/user', AdministrationOfUserAPIView)

urlpatterns = [
    path('me/whoami', PersonDetailView.as_view(), name='user-detail'),
]

urlpatterns += router.urls
