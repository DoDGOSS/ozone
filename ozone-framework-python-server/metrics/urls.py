from django.urls import path
from rest_framework import routers
from .views import MetricsView


router = routers.SimpleRouter()

urlpatterns = [
    path('metrics/', MetricsView.as_view(), name='metrics-list'),
]

urlpatterns += router.urls
