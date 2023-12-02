from rest_framework import serializers
from .models import CuposEstacionamiento, Estacionamiento

class CupoEstacionamientoSerializer(serializers.ModelSerializer):
    class Meta:
        model = CuposEstacionamiento
        fields = ['cupo_funcionarios', 'cupo_estudiantes', 'cupo_visitas']

class EstacionamientoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Estacionamiento
        fields = '__all__'