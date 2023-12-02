from django.db import models

# Create your models here.

class CuposEstacionamiento(models.Model):
    cupo_funcionarios = models.PositiveIntegerField(default=30, null=False, blank=False)
    cupo_estudiantes = models.PositiveIntegerField(default=60, null=False, blank=False)
    cupo_visitas = models.PositiveIntegerField(default=10, null=False, blank=False)

    # Con este metodo, la vista scan_code_bar, incrementa los cupos y decrementa, cuando un usuario entra resta y si sale suma.
    def actualizar_cupos(self, tipo_usuario, incrementar=True):
        if incrementar:
            if tipo_usuario == 0:
                self.cupo_funcionarios += 1
            elif tipo_usuario == 1:
                self.cupo_estudiantes += 1
            elif tipo_usuario == 2:
                self.cupo_visitas += 1
        else:
            if tipo_usuario == 0 and self.cupo_funcionarios > 0:
                self.cupo_funcionarios -= 1
            elif tipo_usuario == 1 and self.cupo_estudiantes > 0:
                self.cupo_estudiantes -= 1
            elif tipo_usuario == 2 and self.cupo_visitas > 0:
                self.cupo_visitas -= 1

    # Guardo los cambios
    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)

    # Retorno la informacion en tiempo real de los cupos 
    def __str__(self):
        return f'CuposEstacionamiento - Funcionarios: {self.cupo_funcionarios}, Estudiantes: {self.cupo_estudiantes}, Visitas: {self.cupo_visitas}'


# En el futuro esta tabla ayuada para la escalabilidad del sistema, aca podria colocar, como en algun futuro tarifas, o horarios. 
class Estacionamiento(models.Model):
    configuracion = models.OneToOneField(CuposEstacionamiento, on_delete=models.CASCADE)

    def __str__(self):
        return f'Estacionamiento - Funcionarios: {self.configuracion.cupo_funcionarios}, Estudiantes: {self.configuracion.cupo_estudiantes}, Visitas: {self.configuracion.cupo_visitas}'

