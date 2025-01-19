from django.db import models
from django.contrib.auth.models import Group
from django.contrib.auth.models import AbstractUser
import uuid


# Create your models here.
class School(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    modules = models.ManyToManyField(Group,related_name='school')
    name = models.CharField(max_length=100)
    contact_number = models.CharField(max_length=100)
    email = models.CharField(max_length=100)
    cambridge_certified = models.BooleanField(default=True)
    license_activation_date = models.DateTimeField(auto_now_add=True)
    license_key = models.CharField(default = 'ALL_ALLOWED', max_length=100)
    school_acronym = models.CharField(max_length=100, null=True)

    def __str__(self):
        return self.name

class User(AbstractUser):
     # Adding UUID-based unique ID
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    ROLE_CHOICES = [
        ('superuser', 'Superuser'),
        ('admin', 'School Admin'),
        ('instructor', 'Instructor'),
        ('student', 'Student'),
        ('parent', 'Parent'),
    ]
    role = models.CharField(max_length=20, choices=ROLE_CHOICES)
    school = models.ForeignKey(School, on_delete=models.SET_NULL, null=True, blank=True, related_name="users")
    
    def __str__(self):
        return self.username



