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
from drf_yasg.views import get_schema_view
from drf_yasg import openapi
from .views import SystemVersionView, HelpFileView
from rest_framework import permissions
from django.conf import settings
from django.conf.urls.static import static

schema_view = get_schema_view(
   openapi.Info(
      title="OWF Server API",
      default_version='v2',
      description="OWF Server Endpoints",
      terms_of_service="",
      contact=openapi.Contact(email=""),
      license=openapi.License(name="MIT License"),
   ),
   public=True,
   permission_classes=(permissions.AllowAny,),
)


urlpatterns = [
        path('admin/', admin.site.urls),
        re_path(r'^$', schema_view.with_ui('swagger', cache_timeout=0), name='schema-swagger-ui'),
        re_path(r'^redoc/$', schema_view.with_ui('redoc', cache_timeout=0), name='schema-redoc'),
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
        path('help', HelpFileView.as_view(), name='help_files'),
    ] + static(settings.HELP_FILES_URL, document_root=settings.HELP_FILES)
