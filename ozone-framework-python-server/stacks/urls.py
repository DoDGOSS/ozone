from .views import StackViewSet
from rest_framework import routers
from stacks.administration.views import StackAdminViewSet

router = routers.SimpleRouter()

router.register(r'stacks', StackViewSet, base_name='stacks')
router.register(r'admin/stacks', StackAdminViewSet, base_name='admin_stacks')

urlpatterns = [

]
urlpatterns += router.urls
