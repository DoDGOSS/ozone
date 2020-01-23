from .views import DashboardViewSet, DashboardAdminViewSet
from rest_framework import routers


router = routers.SimpleRouter()
router.register(r'dashboards', DashboardViewSet, base_name='dashboards')
router.register(r'admin/dashboards', DashboardAdminViewSet, base_name='admin_dashboards')

urlpatterns = [
]
urlpatterns += router.urls
