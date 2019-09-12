from rest_framework import routers
from .views import StackViewSet, StackAdminViewSet


router = routers.SimpleRouter()

router.register(r'stacks', StackViewSet, base_name='stacks')
router.register(r'admin/stacks', StackAdminViewSet, base_name='admin_stacks')

urlpatterns = [

]
urlpatterns += router.urls
