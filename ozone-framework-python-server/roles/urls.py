from .views import RolesViewSet
from rest_framework import routers


router = routers.SimpleRouter()
router.register(r'roles', RolesViewSet)

urlpatterns = [
]
urlpatterns += router.urls
