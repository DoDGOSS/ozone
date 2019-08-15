from django.db import models


class DomainMapping(models.Model):
    id = models.BigAutoField(primary_key=True)
    version = models.BigIntegerField()
    src_id = models.BigIntegerField()
    src_type = models.CharField(max_length=255)
    relationship_type = models.CharField(max_length=8, blank=True, null=True)
    dest_id = models.BigIntegerField()
    dest_type = models.CharField(max_length=255)

    def __str__(self):
        return f'src ype = {self.src_type} & dest type = {self.dest_type}'

    class Meta:
        managed = True
        db_table = 'domain_mapping'
