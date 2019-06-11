from django.contrib import admin
from owf_framework.people.admin import PersonWidgetDefinitionInline
from .models import WidgetDefinition


class WidgetDefinitionAdmin(admin.ModelAdmin):
    list_display = ('id', 'display_name', 'universal_name', 'widget_guid', 'description')
    search_fields = ('display_name', 'universal_name', 'widget_guid')
    inlines = [PersonWidgetDefinitionInline, ]


admin.site.register(WidgetDefinition, WidgetDefinitionAdmin)
