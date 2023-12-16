from rest_framework import serializers
from .models import CustomUser
from .validaciones import validar_rut, validar_password

class AdminSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ['id','username', 'email', 'password','nombre', 'apellido', 'rut', 'is_active']
        extra_kwargs = {'password': {'write_only': True}}

    # Validación RUT reales
    def validate_rut(self, value):
        if not validar_rut(value):
            raise serializers.ValidationError("El RUT no es valido.")
        return value
    
    # Validación si el rut ya existe en BD
    def validate(self, data):
        # Verificar si la clave 'rut' está presente en data
        rut_to_check = data.get('rut')
        
        if rut_to_check is not None:
            user_id_to_exclude = self.instance.id if self.instance else None

            rut_existente = CustomUser.objects.filter(
                rut=rut_to_check
            ).exclude(
                id=user_id_to_exclude
            ).exists()

            if rut_existente:
                raise serializers.ValidationError({"error": ["Este RUT ya está registrado."]})

        return data
    
    # Validación de la contraseña para requerir complejidad
    def validate_password(self, value):
        es_segura, errores = validar_password(value)

        # Si es falso 
        if not es_segura:
            raise serializers.ValidationError({"message": errores})

        return value


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
            # Validar que los campos 'nombre', 'apellido' y 'rut' no se estén cambiando
            if 'nombre' in validated_data or 'apellido' in validated_data or 'rut' in validated_data:
                raise serializers.ValidationError({
                    "message": "No se permite cambiar los campos 'nombre', 'apellido' o 'rut'."
                })

            # Actualiza un usuario existente con la información validada
            instance.username = validated_data.get('username', instance.username)
            instance.email = validated_data.get('email', instance.email)
            instance.is_active = validated_data.get('is_active', instance.is_active)  

            # Si hay una nueva contraseña, crea una nueva encriptación
            new_password = validated_data.get('password', None)
            if new_password:
                instance.set_password(new_password)

            instance.save()
            return instance
        except serializers.ValidationError as e:
            print(f'Error de validación: {e}')
            raise

