from django.urls import path, re_path

from .views import (
    has_preference, prefs_widget_list_user_and_group, server_resources, whoami, widget_has_marketplace,
    widget_type_list, PreferencesViewSet
)

preferences = PreferencesViewSet.as_view({
    'get': 'get',
    'post': 'create_update',
    'put': 'create_update',
})

urlpatterns = [
    path('person/whoami/', whoami),
    path('prefs/hasPreference/<str:namespace>/<str:path>', has_preference),
    path('prefs/preference/<str:namespace>/<str:path>', preferences),
    path('prefs/server/resources/', server_resources),
    re_path(r'prefs/widget/listUserAndGroupWidgets/?$', prefs_widget_list_user_and_group),
    path('widget/hasMarketplace/', widget_has_marketplace),
    path('widgettype/list/', widget_type_list),
]
