from django.contrib import admin
from .models import Dashboard


class DashboardAdmin(admin.ModelAdmin):
    list_display = ('id', 'user', 'guid', 'name', 'description', 'stack')
    search_fields = ('name', 'user')


admin.site.register(Dashboard, DashboardAdmin)
