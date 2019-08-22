from django.urls import path
from .views import PreferenceUserViewSet, UserHasPreferenceUserViewSet
from.administration.views import PreferenceAdminViewSet
from rest_framework import routers

router = routers.SimpleRouter()

router.register(r'preferences', PreferenceUserViewSet, base_name='base_preferences')
router.register(r'admin/preferences', PreferenceAdminViewSet, base_name='admin_preferences')
router.register(r'user/preferences', UserHasPreferenceUserViewSet, base_name='user_preferences')


urlpatterns = [

]
urlpatterns += router.urls
