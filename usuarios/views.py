###### REST FRAMEWORK ######
from rest_framework.decorators import api_view
from rest_framework.response import Response

###### IMPORTACIÓN SERIALIZERS ######
from .serializers import UsuarioSerializer

###### IMPORTACIÓN MODELOS ######
from .models import Usuarios

###### IMPORTACIÓN CÓDIGOS DE ESTADOS ######
from rest_framework import status
from django.http import Http404

@api_view(['GET','POST'])
def register_user_api(request):
    #Listar ADMIN
    if request.method == 'GET':
        # Queryset
        user = Usuarios.objects.all()
        serializer = UsuarioSerializer(user, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    # Crear ADMIN
    if request.method == 'POST':
        # Queryset
        serializer = UsuarioSerializer(data=request.data)

        # Validación
        if serializer.is_valid():
            #Validacion por RUT
            rut = serializer.validated_data.get('usu_rut')
            existing_user = Usuarios.objects.filter(usu_rut=rut).first()
    
            if existing_user:
                return Response({'message': '¡Ya existe un Usuario con el mismo RUT!'}, status=status.HTTP_400_BAD_REQUEST)
            
            serializer.save()
            return Response({'message': '¡Usuario creado correctamente!'}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET','PUT', 'DELETE'])
def user_detail_api(request, pk=None):
    try:
        user = Usuarios.objects.get(id=pk)
    except Usuarios.DoesNotExist:
        return Response({'error': 'Usuario no encontrado'}, status=status.HTTP_404_NOT_FOUND)
    
    if request.method == 'GET':
        serializer = UsuarioSerializer(user)
        return Response(serializer.data)
    
    elif request.method == 'PUT':
        serializer = UsuarioSerializer(user, data = request.data)

        # Validación
        if serializer.is_valid():
            serializer.save()
            return Response({'message': '¡Se realizado los cambios con exito!'}, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    #Eliminar ADMIN
    elif request.method == 'DELETE':
        try:
            user.delete()
            return Response({'message': '¡Usuario se ha eliminado correctamente!'}, status=status.HTTP_204_NO_CONTENT)
        
        except Exception as e:
            return Response({'message': f'Error al eliminar el usuario: {str(e)}'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    