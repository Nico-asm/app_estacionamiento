from rest_framework import serializers
from .models import CodigosBarra
from usuarios.models import Usuarios

class CodigoBarraSerializer(serializers.ModelSerializer):
    class Meta:
        model = CodigosBarra
        fields = '__all__'
        read_only_fields = ('id','cod_fecha') # Estos campos solo seran de lectura y no podran ser actualizados


class GenerarCodigoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Usuarios
        fields = ['usu_rut']