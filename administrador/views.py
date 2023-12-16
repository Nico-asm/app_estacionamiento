###### REST FRAMEWORK ######
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response

###### VALIDACIONES ######

from django.contrib.auth import authenticate
from django.core.exceptions import ObjectDoesNotExist
from rest_framework.permissions import IsAuthenticated

###### TOKEN JWT ######
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.exceptions import TokenError


###### IMPORTACIÓN SERIALIZERS ######
from .serializers import AdminSerializer
###### IMPORTACIÓN MODELOS ######
from .models import CustomUser

###### IMPORTACIÓN CÓDIGOS DE ESTADOS ######
from rest_framework import status


####### REGISTRO ADMINISTRADOR #######
@api_view(['GET','POST'])
@permission_classes([IsAuthenticated])##
def register_admin(request):

    #Listar ADMIN
    if request.method == 'GET':
        # Queryset
        user = CustomUser.objects.all()
        serializer = AdminSerializer(user, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    # Crear ADMIN
    if request.method == 'POST':
        # Queryset
        serializer = AdminSerializer(data=request.data)

        # Validación
        if serializer.is_valid():
            serializer.save()
            return Response({'message': '¡Administrador creado correctamente!'}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET','PATCH', 'DELETE'])
@permission_classes([IsAuthenticated])
def admin_detail(request, pk=None):
    #Validación ADMIN
    try:
        user = CustomUser.objects.get(id=pk)
    except CustomUser.DoesNotExist:
        return Response({'error': 'Administrador no encontrado'}, status=status.HTTP_404_NOT_FOUND)
    
    #Listar ADMIN
    if request.method == 'GET':
        serializer = AdminSerializer(user)
        return Response(serializer.data)
    
    #Editar ADMIN
    elif request.method == 'PATCH':
        serializer = AdminSerializer(user, data = request.data, partial = True) #Sin partial = true no deja usar patch

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
def admin_login(request):
    # Obtener Datos
    if request.method == 'POST':
        username = request.data.get('username') 
        password = request.data.get('password')

        # Validación
        user = None
        if '@' in username:
            try:
                user = CustomUser.objects.get(email=username)
            except ObjectDoesNotExist:
                pass

        if not user:
            user = authenticate(username=username, password=password)

        if user:
            if user.is_active:
            # Generar tokens JWT
                refresh = RefreshToken.for_user(user)
                data = {
                    'message': 'Inicio de sesión exitoso',
                    'username': user.username,
                    'refresh': str(refresh),
                    'access': str(refresh.access_token),
                }
                return Response(data, status=status.HTTP_200_OK)
            else:
                return Response({'error': 'El usuario no está activo.'}, status=status.HTTP_401_UNAUTHORIZED)

        else:
            return Response({'error': 'Credenciales inválidas.'}, status=status.HTTP_401_UNAUTHORIZED)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def admin_logout(request):
    if request.method == 'POST':
        try:
            # Invalidar el token de acceso (blacklist)
            refresh_token = request.data.get('refresh_token')
            token = RefreshToken(refresh_token)
            token.blacklist()
            return Response({'message': 'Sesión cerrada exitosamente.'}, status=status.HTTP_200_OK)
        except TokenError as e:
            return Response({'error': f'Token inválido o expirado: {str(e)}'}, status=status.HTTP_400_BAD_REQUEST)
# Listas administradores
@api_view(['GET'])
def admin_list(request):
    if request.method == 'GET':
        admins = CustomUser.objects.all()
        serializer = AdminSerializer(admins, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)