from django.db import models

# Create your models here.

from django.contrib.auth.models import AbstractUser
from django.db import models

class CustomUser(AbstractUser):
    nombre = models.CharField(max_length=30, null=True, blank=False)
    apellido = models.CharField(max_length=30, null=True, blank=False)
    rut = models.CharField(max_length=10, null=True, blank=False)
    email = models.EmailField(unique=True)    

    def __str__(self):
        return self.username