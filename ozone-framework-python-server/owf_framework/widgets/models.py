from django.db import models
from django.core.validators import MinValueValidator


class WidgetDefinition(models.Model):
    id = models.BigAutoField(primary_key=True)
    version = models.BigIntegerField(default=1)
    width = models.IntegerField(default=0, validators=[MinValueValidator(0)], blank=False)
    image_url_medium = models.CharField(null=False, blank=False, max_length=2083)
    singleton = models.BooleanField(blank=False, default=False)
    universal_name = models.CharField(null=True, blank=True, max_length=255)
    display_name = models.CharField(null=False, blank=False, max_length=256)
    widget_guid = models.CharField(unique=True, null=False, blank=False, max_length=255)
    mobile_ready = models.BooleanField(blank=False, default=False)
    widget_version = models.CharField(null=True, blank=True, max_length=2083)
    height = models.IntegerField(default=0, validators=[MinValueValidator(0)], blank=False)
    background = models.BooleanField(blank=False, default=False)
    widget_url = models.CharField(null=False, blank=False, max_length=2083)
    image_url_small = models.CharField(null=False, blank=False, max_length=2083)
    descriptor_url = models.CharField(null=True, blank=True, max_length=2083)
    description = models.CharField(max_length=255, blank=True, null=True)
    visible = models.BooleanField(blank=False, default=True)

    def __str__(self):
        return self.display_name

    class Meta:
        db_table = 'widget_definition'
