from django.db import models


class Role(models.Model):
    id = models.BigAutoField(primary_key=True)
    version = models.BigIntegerField()
    authority = models.CharField(unique=True, max_length=255)
    description = models.CharField(max_length=255)

    def __str__(self):
        return self.description

    class Meta:
        managed = True
        db_table = 'role'
