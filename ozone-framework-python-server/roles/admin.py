from django.contrib import admin
from .models import Role


class RoleAdmin(admin.ModelAdmin):
    list_display = ('id', 'authority', 'description')
    search_fields = ('authority', 'description')


admin.site.register(Role, RoleAdmin)
