from rest_framework import serializers
from .models import Usuarios



class UsuarioSerializer(serializers.ModelSerializer):
    usu_rut = serializers.CharField(
        max_length=10,
        error_messages={
            'max_length': 'El RUT debe tener un máximo de 10 caracteres. Debe ser SIN punto y CON guión.',
            'blank': 'El RUT no puede estar en blanco.',
            'invalid': 'El RUT no es válido. Debe ser SIN punto y CON guión.',
        },
    )

    class Meta:
        model = Usuarios
        fields = '__all__'
        read_only_fields = ('id','usu_fecha') # Estos campos solo seran de lectura y no podran ser actualizados