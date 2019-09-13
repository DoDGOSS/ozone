from django.contrib import admin
from .models import Stack, StackGroups


class StackAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'description')
    search_fields = ('name',)


class StackGroupsAdmin(admin.ModelAdmin):
    list_display = ('id', 'stack', 'group')
    search_fields = ('stack', 'group', )


admin.site.register(Stack, StackAdmin)
admin.site.register(StackGroups, StackGroupsAdmin)
