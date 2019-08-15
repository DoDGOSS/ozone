from django.contrib import admin
from .models import Intent, IntentDataType


class IntentAdmin(admin.ModelAdmin):
    list_display = ('id', 'action')
    search_fields = ('action', )


class IntentDataTypeAdmin(admin.ModelAdmin):
    list_display = ('id', 'data_type')
    search_fields = ('data_type', )


admin.site.register(Intent, IntentAdmin)
admin.site.register(IntentDataType, IntentDataTypeAdmin)
