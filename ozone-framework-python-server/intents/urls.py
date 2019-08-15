from .views import IntentDataTypesViewSet, IntentDataTypeViewSet, IntentViewSet
from rest_framework import routers


router = routers.SimpleRouter()
router.register(r'intent-data-type', IntentDataTypeViewSet)
router.register(r'intent-data-types', IntentDataTypesViewSet)
router.register(r'intent', IntentViewSet)


urlpatterns = [
]
urlpatterns += router.urls
