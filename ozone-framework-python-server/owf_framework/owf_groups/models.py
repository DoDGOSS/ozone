from django.db import models

class OWFGroup(models.Model):
    id = models.BigAutoField(primary_key=True)
    version = models.BigIntegerField(default=1)
    stack_id = models.BigIntegerField(blank=True, null=True)
    display_name = models.CharField(null=True, blank=True, max_length=200)
    stack_default = models.BooleanField(blank=False, null=False)
    name = models.CharField(null=False, blank=False, max_length=200)
    status = models.CharField(null=False, blank=False, max_length=8)
    description = models.CharField(blank=True, null=True, max_length=255)
    email = models.CharField(blank=True, null=True, max_length=255)
    automatic = models.BooleanField(blank=False, null=False)

    def __str__(self):
        return self.name

    class Meta:
        db_table = 'owf_group'
