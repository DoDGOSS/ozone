from django.urls import path
from rest_framework import routers
from .administration.views import AdministrationOfUserAPIView
from .views import PersonDetailView, PersonDashboardsWidgetsView, PersonWidgetDefinitionViewSet, PersonStackViewset


router = routers.SimpleRouter()
router.register(r'admin/users', AdministrationOfUserAPIView)
router.register(r'admin/users-widgets', PersonWidgetDefinitionViewSet, base_name='admin_users-widgets')

urlpatterns = [
    path('me/', PersonDetailView.as_view(), name='user-detail'),
    path('me/dashboards-widgets/', PersonDashboardsWidgetsView.as_view(), name='user-widgets-dashboards-detail'),
    path('admin/users-stacks/', PersonStackViewset.as_view(), name='admin_users-stacks')
]

urlpatterns += router.urls
