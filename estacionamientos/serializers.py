from rest_framework import serializers
from .models import CuposEstacionamiento

class CupoEstacionamientoSerializer(serializers.ModelSerializer):
    class Meta:
        model = CuposEstacionamiento
        fields = ['cupo_funcionarios', 'cupo_estudiantes', 'cupo_visitas']
