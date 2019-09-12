from .views import DashboardViewSet
from rest_framework import routers


router = routers.SimpleRouter()
router.register(r'dashboards', DashboardViewSet, base_name='dashboards')


urlpatterns = [
]
urlpatterns += router.urls
