from .views import OWFGroupPeopleViewSet, OWFGroupViewSet
from rest_framework import routers


router = routers.SimpleRouter()
router.register(r'admin/groups', OWFGroupViewSet)
router.register(r'groups-people', OWFGroupPeopleViewSet)


urlpatterns = [
]
urlpatterns += router.urls
