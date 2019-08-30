from django.contrib import admin
from .models import ApplicationConfiguration


class AppConfAdmin(admin.ModelAdmin):
    list_display = ('title', 'description', 'code')
    search_fields = ('title', 'code')


admin.site.register(ApplicationConfiguration, AppConfAdmin)
