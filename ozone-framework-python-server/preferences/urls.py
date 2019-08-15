from django.urls import path
from .views import PreferenceUserViewSet
from rest_framework import routers

router = routers.SimpleRouter()

router.register(r'preferences', PreferenceUserViewSet, base_name='user_preferences')

urlpatterns = [

]
urlpatterns += router.urls
