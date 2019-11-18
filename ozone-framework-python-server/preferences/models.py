import time
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

    def save(self, *args, **kwargs):
        # Version saver for incrementing as time
        self.version = int(time.time())
        super(Preference, self).save(*args, **kwargs)

    class Meta:
        managed = True
        db_table = 'preference'
        unique_together = (('path', 'namespace', 'user'),)
        constraints = [
            models.UniqueConstraint(fields=['path', 'namespace', 'user'], name='unique_path_namespace_user_preference')
        ]
