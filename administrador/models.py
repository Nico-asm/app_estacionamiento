from django.db import models

# Create your models here.

from django.contrib.auth.models import AbstractUser

class CustomUser(AbstractUser):
    nombre = models.CharField(max_length=30, null=False, blank=False)
    apellido = models.CharField(max_length=30, null=False, blank=False)
    rut = models.CharField(max_length=10, null=False, blank=False)
    email = models.EmailField(unique=True, null=False, blank=False)    

    def __str__(self):
        return self.username