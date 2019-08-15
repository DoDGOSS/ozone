from .views import DashboardViewSet, DashboardNestViewSet
from rest_framework import routers


router = routers.SimpleRouter()
router.register(r'dashboards', DashboardViewSet)
router.register(r'dashboards_nested_example', DashboardNestViewSet, base_name='nested-dashboard')


urlpatterns = [
]
urlpatterns += router.urls
