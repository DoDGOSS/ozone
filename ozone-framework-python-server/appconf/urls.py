from .views import AppConfViewSet
from rest_framework import routers


router = routers.SimpleRouter()
router.register(r'admin/appconf', AppConfViewSet)


urlpatterns = [
]
urlpatterns += router.urls
