from rest_framework import serializers
from .models import CodigosBarra


class CodigoBarraSerializer(serializers.ModelSerializer):
    class Meta:
        model = CodigosBarra
        fields = '__all__'
        read_only_fields = ('id','cod_fecha') # Estos campos solo seran de lectura y no podran ser actualizados


