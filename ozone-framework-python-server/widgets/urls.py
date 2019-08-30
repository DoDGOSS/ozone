from django.conf.urls import include
from django.urls import path
from .views import WidgetDefinitionViewSet, WidgetTypesViewSet
from rest_framework import routers

router = routers.SimpleRouter()

router.register(r'admin/widgets', WidgetDefinitionViewSet, base_name='widgets')
router.register(r'admin/widgets-types', WidgetTypesViewSet, base_name='widget-types')


urlpatterns = [

]
urlpatterns += router.urls
