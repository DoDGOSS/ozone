from django.urls import path

from .views import has_preference, server_resources, whoami, PreferencesViewSet

preferences = PreferencesViewSet.as_view({
    'get': 'get',
    'post': 'create_update',
    'put': 'create_update',
})

urlpatterns = [
    path('person/whoami/', whoami),
    path('prefs/hasPreference/<str:namespace>/<str:path>/', has_preference),
    path('prefs/preference/<str:namespace>/<str:path>/', preferences),
    path('prefs/server/resources/', server_resources),
]
