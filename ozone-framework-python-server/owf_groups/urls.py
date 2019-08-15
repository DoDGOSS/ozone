from .views import OWFGroupPeopleViewSet, OWFGroupViewSet
from rest_framework import routers


router = routers.SimpleRouter()
router.register(r'groups', OWFGroupPeopleViewSet)
router.register(r'groups-people', OWFGroupViewSet)


urlpatterns = [
]
urlpatterns += router.urls
