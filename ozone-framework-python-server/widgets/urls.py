from django.conf.urls import include
from django.urls import path
from .views import WidgetDefinitionViewSet
from rest_framework import routers

router = routers.SimpleRouter()

router.register(r'admin/widgets', WidgetDefinitionViewSet, base_name='widgets')

urlpatterns = [

]
urlpatterns += router.urls

