from django.db import models
from usuarios.models import Usuarios

# Create your models here.

class CodigosBarra(models.Model):
    cod_generado = models.CharField(max_length=255, blank=False, null=False)
    cod_fecha = models.DateField(auto_now_add=True, blank=False, null=False)
    cod_imagen = models.ImageField(upload_to="codigos_barra/")
    fk_usuario = models.ForeignKey(Usuarios, on_delete=models.CASCADE)

    