from django.contrib import admin
from .models import OwfGroup, OwfGroupPeople


class OWFGroupAdmin(admin.ModelAdmin):
    list_display = ('id', 'display_name', 'name', 'status', 'description')
    search_fields = ('display_name', 'name',)
    verbose_name = 'OWF Group'
    verbose_name_plural = 'OWF Groups'
    exclude = ('person',)


class OWFGroupPeopleAdmin(admin.ModelAdmin):
    list_display = ('group', 'person')
    search_fields = ('groups', 'person')


admin.site.register(OwfGroupPeople, OWFGroupPeopleAdmin)


admin.site.register(OwfGroup, OWFGroupAdmin)
