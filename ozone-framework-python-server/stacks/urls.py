from django.urls import path
from .views import StackViewSet
from rest_framework import routers

router = routers.SimpleRouter()

router.register(r'stacks', StackViewSet, base_name='stack')

urlpatterns = [

]
urlpatterns += router.urls
