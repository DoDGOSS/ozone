from django.contrib import admin
from .models import Stack


class StackAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'description')
    search_fields = ('name',)


admin.site.register(Stack, StackAdmin)
