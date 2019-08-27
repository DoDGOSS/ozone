from django.db import models
from django.contrib.auth.models import User
from people.models import Person


class Preference(models.Model):
    id = models.BigAutoField(primary_key=True)
    version = models.BigIntegerField(default=0)
    value = models.TextField()
    path = models.CharField(max_length=200)
    user = models.ForeignKey(Person, on_delete=models.CASCADE)
    namespace = models.CharField(max_length=200)

    def __str__(self):
        return f'user = {self.user.username} & namespace = {self.namespace}'

    class Meta:
        managed = True
        db_table = 'preference'
        unique_together = (('path', 'namespace', 'user'),)
