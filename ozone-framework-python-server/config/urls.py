"""owf_framework URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/2.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.conf.urls import include
from django.urls import path, re_path
from rest_framework_swagger.views import get_swagger_view
from .views import SystemVersionView

schema_view = get_swagger_view(title='OWF Server V2 API')


urlpatterns = [
        path('admin/', admin.site.urls),
        re_path(r'^$', schema_view),
        path('accounts/', include('rest_framework.urls')),
        path('api/v2/', include('dashboards.urls')),
        path('api/v2/', include('intents.urls')),
        path('api/v2/', include('owf_groups.urls')),
        path('api/v2/', include('people.urls')),
        path('api/v2/', include('preferences.urls')),
        path('api/v2/', include('roles.urls')),
        path('api/v2/', include('stacks.urls')),
        path('api/v2/', include('widgets.urls')),
        path('api/v2/', include('appconf.urls')),
        path('system-version', SystemVersionView.as_view(), name='system-version-url'),
    ]
