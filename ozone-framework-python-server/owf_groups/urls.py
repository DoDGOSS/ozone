from django.urls import path

from .views import OWFGroupPeopleViewSet, OWFGroupViewSet, OWFGroupWidgetViewSet
from rest_framework import routers

router = routers.SimpleRouter()
router.register(r'admin/groups', OWFGroupViewSet, base_name='admin_groups')
router.register(r'admin/groups-people', OWFGroupPeopleViewSet, base_name='admin_groups-people')

urlpatterns = [
    path('group-widgets/', OWFGroupWidgetViewSet.as_view(), name='group_widgets'),
]
urlpatterns += router.urls
