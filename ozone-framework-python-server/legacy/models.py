from django.db import models


class ApplicationConfiguration(models.Model):
    id = models.BigAutoField(primary_key=True)
    version = models.BigIntegerField()
    created_by = models.ForeignKey('Person', models.DO_NOTHING, blank=True, null=True)
    created_date = models.DateField(blank=True, null=True)
    edited_by = models.ForeignKey('Person', models.DO_NOTHING, blank=True, null=True)
    edited_date = models.DateField(blank=True, null=True)
    code = models.CharField(unique=True, max_length=250)
    value = models.CharField(max_length=2000, blank=True, null=True)
    title = models.CharField(max_length=250)
    description = models.CharField(max_length=2000, blank=True, null=True)
    type = models.CharField(max_length=250)
    group_name = models.CharField(max_length=250)
    sub_group_name = models.CharField(max_length=250, blank=True, null=True)
    mutable = models.BooleanField()
    sub_group_order = models.BigIntegerField(blank=True, null=True)
    help = models.CharField(max_length=2000, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'application_configuration'


class Databasechangelog(models.Model):
    id = models.CharField(max_length=255)
    author = models.CharField(max_length=255)
    filename = models.CharField(max_length=255)
    dateexecuted = models.DateTimeField()
    orderexecuted = models.IntegerField()
    exectype = models.CharField(max_length=10)
    md5sum = models.CharField(max_length=35, blank=True, null=True)
    description = models.CharField(max_length=255, blank=True, null=True)
    comments = models.CharField(max_length=255, blank=True, null=True)
    tag = models.CharField(max_length=255, blank=True, null=True)
    liquibase = models.CharField(max_length=20, blank=True, null=True)
    contexts = models.CharField(max_length=255, blank=True, null=True)
    labels = models.CharField(max_length=255, blank=True, null=True)
    deployment_id = models.CharField(max_length=10, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'databasechangelog'


class Databasechangeloglock(models.Model):
    id = models.IntegerField(primary_key=True)
    locked = models.BooleanField()
    lockgranted = models.DateTimeField(blank=True, null=True)
    lockedby = models.CharField(max_length=255, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'databasechangeloglock'


class Requestmap(models.Model):
    id = models.BigAutoField(primary_key=True)
    version = models.BigIntegerField()
    url = models.CharField(unique=True, max_length=255)
    config_attribute = models.CharField(max_length=255)

    class Meta:
        managed = False
        db_table = 'requestmap'


class TagLinks(models.Model):
    id = models.BigAutoField(primary_key=True)
    version = models.BigIntegerField()
    pos = models.BigIntegerField(blank=True, null=True)
    visible = models.BooleanField(blank=True, null=True)
    tag_ref = models.BigIntegerField()
    tag = models.ForeignKey('Tags', models.DO_NOTHING)
    type = models.CharField(max_length=255)
    editable = models.BooleanField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'tag_links'


class Tags(models.Model):
    id = models.BigAutoField(primary_key=True)
    version = models.BigIntegerField()
    name = models.CharField(unique=True, max_length=255)

    class Meta:
        managed = False
        db_table = 'tags'

