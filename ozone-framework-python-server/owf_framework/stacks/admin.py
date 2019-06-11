from django.contrib import admin
from .models import Stack


class StackGroupInline(admin.TabularInline):
    model = Stack.groups.through


class StackAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'description')
    search_fields = ('name',)
    inlines = [StackGroupInline, ]


admin.site.register(Stack, StackAdmin)
