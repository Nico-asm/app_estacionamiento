from django.db import models

# Create your models here.


class CuposEstacionamiento(models.Model):
    cupo_funcionarios = models.PositiveIntegerField(default=30, null=False, blank=False)
    cupo_estudiantes = models.PositiveIntegerField(default=60, null=False, blank=False)
    cupo_visitas = models.PositiveIntegerField(default=10, null=False, blank=False)

    def actualizar_cupos(self, tipo_usuario):
        if tipo_usuario == 0 and self.cupo_funcionarios > 0:
                self.cupo_funcionarios -= 1
        elif tipo_usuario == 1 and self.cupo_estudiantes > 0:
                self.cupo_estudiantes -= 1
        elif tipo_usuario == 2 and self.cupo_visitas > 0:
                self.cupo_visitas -= 1

    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)

    def __str__(self):
        return f'CuposEstacionamiento - Funcionarios: {self.cupo_funcionarios}, Estudiantes: {self.cupo_estudiantes}, Visitas: {self.cupo_visitas}'



class Estacionamiento(models.Model):
    configuracion = models.OneToOneField(CuposEstacionamiento, on_delete=models.CASCADE)

    def __str__(self):
        return f'Estacionamiento - Funcionarios: {self.configuracion.cupo_funcionarios}, Estudiantes: {self.configuracion.cupo_estudiantes}, Visitas: {self.configuracion.cupo_visitas}'

