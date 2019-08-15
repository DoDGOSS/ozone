from django.contrib import admin
from .models import DomainMapping


class DomainMappingAdmin(admin.ModelAdmin):
    list_display = ('id', 'src_type', 'src_id', 'relationship_type', 'dest_type', 'dest_id')
    search_fields = ('src_type', 'src_id', 'relationship_type', 'dest_type', 'dest_id')


admin.site.register(DomainMapping, DomainMappingAdmin)
