###### REST FRAMEWORK ######
from rest_framework.decorators import api_view, permission_classes, authentication_classes
from rest_framework.response import Response

###### VALIDACIONES ######
from rest_framework.authtoken.models import Token
from django.contrib.auth import authenticate
from django.core.exceptions import ObjectDoesNotExist
from rest_framework.permissions import IsAuthenticated
from rest_framework.authentication import TokenAuthentication

###### IMPORTACIÓN SERIALIZERS ######
from .serializers import UserSerializer

###### IMPORTACIÓN MODELOS ######
from .models import CustomUser

###### IMPORTACIÓN CÓDIGOS DE ESTADOS ######
from rest_framework import status
from django.http import Http404


####### REGISTRO USUARIOS ADMINISTRADOR #######
@api_view(['GET','POST'])
@authentication_classes([TokenAuthentication]) #Comprueba si esta autenticado
@permission_classes([IsAuthenticated]) #Verifica los permisos
def register_user(request):

    #Listar ADMIN
    if request.method == 'GET':
        # Queryset
        user = CustomUser.objects.all()
        serializer = UserSerializer(user, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    # Crear ADMIN
    if request.method == 'POST':
        # Queryset
        serializer = UserSerializer(data=request.data)

        # Validación
        if serializer.is_valid():
            serializer.save()
            return Response({'message': '¡Administrador creado correctamente!'}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET','PUT', 'DELETE'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def user_detail(request, pk=None):
    #Validación ADMIN
    try:
        user = CustomUser.objects.get(id=pk)
    except CustomUser.DoesNotExist:
        return Response({'error': 'Administrador no econtrado'}, status=status.HTTP_404_NOT_FOUND)
    
    #Listar ADMIN
    if request.method == 'GET':
        serializer = UserSerializer(user)
        return Response(serializer.data)
    
    #Editar ADMIN
    elif request.method == 'PUT':
        serializer = UserSerializer(user, data = request.data)

        # Validación
        if serializer.is_valid():
            serializer.save()
            return Response({'message': '¡Se realizado los cambios con exito!'}, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    #Eliminar ADMIN
    elif request.method == 'DELETE':
        try:
            user.delete()
            return Response({'message': '¡Administrador eliminado correctamente!'}, status=status.HTTP_204_NO_CONTENT)
        
        except Exception as e:
            return Response({'message': f'Error al eliminar el usuario: {str(e)}'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)



####### LOGIN ADMINISTRADOR #######
@api_view(['POST'])
def user_login(request):
    #Obtener Datos
    if request.method == 'POST':
        username = request.data.get('username') 
        password = request.data.get('password')

        # Validación
        user = None
        if '@' in username: # Comprueba si el usuarios uso Email o nombre de usuario para ingresar
            try:
                user = CustomUser.objects.get(email=username) # Si entra con Email, lo busca en BD y lo comprueba
            except ObjectDoesNotExist:
                pass

        if not user:
            user = authenticate(username=username, password=password) # Si no entra con Email, buscar por Usuario

        if user:
            token, _ = Token.objects.get_or_create(user=user) # Cuando ingresa genera un Token 
            return Response({'token': token.key}, status=status.HTTP_200_OK)

        return Response({'error': 'Administrador no valido en el sistema'}, status=status.HTTP_401_UNAUTHORIZED) 
    


@permission_classes([IsAuthenticated]) # solo si esta autorizado entra aca
def user_logout(request):
    if request.method == 'POST':
        try:
            request.user.auth_token.delete() # Borra el token generado del Inicio de sesión
            return Response({'message': '¡Se cerro sesión correctamente en el sistema!'}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)