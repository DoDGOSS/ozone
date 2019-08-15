from django.contrib import admin
from .models import Preference


class PreferencesAdmin(admin.ModelAdmin):
    list_display = ('version', 'path', 'namespace', 'value', 'user_id')
    search_fields = ('path', 'user_id',)
    verbose_name = 'Preference'
    verbose_name_plural = 'Preferences'


admin.site.register(Preference, PreferencesAdmin)
