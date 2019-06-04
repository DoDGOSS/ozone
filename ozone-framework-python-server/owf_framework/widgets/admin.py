from django.contrib import admin
from .models import WidgetDefinition

class WidgetDefinitionAdmin(admin.ModelAdmin):
    list_display = ('id', 'display_name', 'universal_name', 'widget_guid', 'description')
    search_fields = ('display_name', 'universal_name', 'widget_guid')

admin.site.register(WidgetDefinition, WidgetDefinitionAdmin)
