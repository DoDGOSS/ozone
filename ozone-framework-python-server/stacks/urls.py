from rest_framework import routers
from .views import StackViewSet, StackAdminViewSet, StackGroupsViewSet


router = routers.SimpleRouter()

router.register(r'stacks', StackViewSet, base_name='stacks')
router.register(r'admin/stacks', StackAdminViewSet, base_name='admin_stacks')
router.register(r'admin/stacks-groups', StackGroupsViewSet, base_name='admin_stacks-groups')

urlpatterns = [

]
urlpatterns += router.urls
