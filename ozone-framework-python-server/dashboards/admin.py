from django.contrib import admin
from .models import Dashboard


class DashboardAdmin(admin.ModelAdmin):
    list_display = ('id', 'guid', 'name', 'description')
    search_fields = ('name',)


admin.site.register(Dashboard, DashboardAdmin)
