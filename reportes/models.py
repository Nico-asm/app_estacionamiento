from django.db import models
from administrador.models import CustomUser
# Create your models here.

class Reportes(models.Model):
    rep_titulo = models.CharField(max_length=50, null=False, blank=False)
    rep_descripcion = models.CharField(max_length=255, blank=False)
    rep_fecha = models.DateField(auto_now_add=True, null=False)
    fk_admin = models.ForeignKey(CustomUser, on_delete=models.CASCADE)

    def __str__(self):
        return f'Titulo: {self.rep_titulo}'
