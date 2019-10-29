from .views import WidgetDefinitionViewSet, WidgetTypesViewSet, WidgetViewSet, WidgetDefinitionWidgetTypesViewSet
from rest_framework import routers

router = routers.SimpleRouter()

router.register(r'admin/widgets', WidgetDefinitionViewSet, base_name='widgets')
router.register(r'admin/widget-definition-widgets-types', WidgetDefinitionWidgetTypesViewSet, base_name='widgets-t-d')
router.register(r'admin/widgets-types', WidgetTypesViewSet, base_name='widget-types')
router.register(r'widgets', WidgetViewSet)


urlpatterns = [

]
urlpatterns += router.urls
