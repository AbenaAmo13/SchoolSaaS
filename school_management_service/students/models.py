from django.db import models

# Create your models here.
from django.db import models

class Student(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=255)
    school_id = models.UUIDField()  # Links to Authentication Service School
    user_id = models.UUIDField()    # Links to Authentication Service User

    def __str__(self):
        return self.name

class Instructor(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=255)
    school_id = models.UUIDField()  # Links to Authentication Service School
    user_id = models.UUIDField()    # Links to Authentication Service User

    def __str__(self):
        return self.name
