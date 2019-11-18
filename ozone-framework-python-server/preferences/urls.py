from rest_framework import routers

from preferences.views import PreferenceUserViewSet, PreferenceAdminViewSet

router = routers.SimpleRouter()
router.register(r'preferences', PreferenceUserViewSet, base_name='base_preferences')
router.register(r'admin/preferences', PreferenceAdminViewSet, base_name='admin_preferences')

urlpatterns = [

]
urlpatterns += router.urls
