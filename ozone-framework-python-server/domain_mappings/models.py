from django.db import models
from enum import Enum

class RelationshipType(Enum):
    owns = 'owns'
    requires = 'requires'
    instanceOf = 'instanceOf'
    cloneOf = 'cloneOf'


class DomainMapping(models.Model):
    id = models.BigAutoField(primary_key=True)
    version = models.BigIntegerField(default=0)
    src_id = models.BigIntegerField()
    src_type = models.CharField(max_length=255)
    relationship_type = models.CharField(
        choices=[(tag.name, tag.value) for tag in RelationshipType],
        default=RelationshipType.owns.name,
        max_length=10,
        blank=True,
        null=True)
    dest_id = models.BigIntegerField()
    dest_type = models.CharField(max_length=255)

    def __str__(self):
        return f'src type = {self.src_type} & dest type = {self.dest_type}'

    class Meta:
        managed = True
        db_table = 'domain_mapping'
