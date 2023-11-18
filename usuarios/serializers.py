from rest_framework import serializers
from .models import Usuarios



class UsuarioSerializer(serializers.ModelSerializer):
    class Meta:
        model = Usuarios
        fields = '__all__'
        read_only_fields = ('id','usu_fecha') # Estos campos solo seran de lectura y no podran ser actualizados