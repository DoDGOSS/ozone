from .views import OWFGroupPeopleViewSet, OWFGroupViewSet
from rest_framework import routers


router = routers.SimpleRouter()
router.register(r'admin/groups', OWFGroupViewSet, base_name='admin_groups')
router.register(r'admin/groups-people', OWFGroupPeopleViewSet, base_name='admin_groups-people')


urlpatterns = [
]
urlpatterns += router.urls
