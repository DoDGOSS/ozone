from django.urls import path
from rest_framework import routers
from .administration.views import AdministrationOfUserAPIView
from .views import PersonDetailView, PersonWidgetDefinitionViewSet


router = routers.SimpleRouter()
router.register(r'admin/user', AdministrationOfUserAPIView)
router.register(r'admin/user-widgets', PersonWidgetDefinitionViewSet, base_name='admin_user-widgets')

urlpatterns = [
    path('me/whoami', PersonDetailView.as_view(), name='user-detail'),
]

urlpatterns += router.urls
