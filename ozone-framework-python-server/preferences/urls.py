from django.urls import path
from .views import PreferenceUserViewSet, PreferenceAdminViewSet
from rest_framework import routers

router = routers.SimpleRouter()

router.register(r'preferences', PreferenceUserViewSet, base_name='user_preferences')
router.register(r'admin/preferences', PreferenceAdminViewSet, base_name='admin_preferences')


urlpatterns = [

]
urlpatterns += router.urls
