from django.db import models

class Usuarios(models.Model):
    opcion_rol = (
        (0, 'Funcionario'),
        (1, 'Estudiante'),
        (2, 'Visita'),
        )
    usu_nombre = models.CharField(max_length=25, blank=False, null=False)
    usu_apellido = models.CharField(max_length=25, blank=False, null=False)
    usu_rut = models.CharField(max_length=10, blank=False, null=False)
    usu_fecha = models.DateField(auto_now_add=True, blank=False, null=False)
    usu_tipo = models.IntegerField(choices=opcion_rol, blank=False, null=False)

    dentro_estacionamiento = models.BooleanField(default=False) 
    
    def __str__(self):
        return f"{self.usu_nombre} {self.usu_apellido}"
    
    