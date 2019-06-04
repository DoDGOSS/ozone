from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from django.contrib.auth.models import User
from .models import Person

from owf_framework.owf_groups.admin import OWFGroupPeopleInline

class PersonAdmin(admin.ModelAdmin):
    list_display = ('id', 'user_real_name', 'username', 'email', 'description')
    search_fields = ('user_real_name', 'username', 'email')
    inlines = [OWFGroupPeopleInline,]

admin.site.register(Person, PersonAdmin)


class PersonInline(admin.StackedInline):
    model = Person
    verbose_name_plural = 'Person'
    fk_name = 'user'

class CustomUserAdmin(UserAdmin):
    inlines = (PersonInline, )

    def get_inline_instances(self, request, obj=None):
        if not obj:
            return list()
        return super(CustomUserAdmin, self).get_inline_instances(request, obj)


admin.site.unregister(User)
admin.site.register(User, CustomUserAdmin)
