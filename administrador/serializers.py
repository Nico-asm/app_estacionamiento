from rest_framework import serializers
from .models import CustomUser

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ['username', 'email', 'password', 'nombre', 'apellido', 'rut']
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        # Valida los datos, duplicidad y que se ingrese lo que se pide
        user = CustomUser(
            username=validated_data['username'],
            email=validated_data['email'],
            nombre=validated_data.get('nombre', ''),
            apellido=validated_data.get('apellido', ''),
            rut=validated_data.get('rut', '')
        )
        #Generan un token a la contraseña
        user.set_password(validated_data['password'])
        user.save()
        return user
    
    def update(self, instance, validated_data):
        try:
            # Actualiza un usuario existente con la información validada
            instance.username = validated_data.get('username', instance.username)
            instance.email = validated_data.get('email', instance.email)

            # Si hay una nueva contraseña, crea una nueva ecriptación
            new_password = validated_data.get('password', None)
            if new_password:
                instance.set_password(new_password)

            instance.save()
            return instance
        except serializers.ValidationError as e:
            print(f'Error de validación: {e}')
            raise