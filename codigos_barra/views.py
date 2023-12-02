###### REST FRAMEWORK ######
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response

###### IMPORTACIÓN SERIALIZERS ######
from .serializers import CodigoBarraSerializer
from usuarios.serializers import UsuarioSerializer
from estacionamientos.serializers import CupoEstacionamientoSerializer

###### IMPORTACIÓN DE MODELOS ######
from usuarios.models import Usuarios
from .models import CodigosBarra
from estacionamientos.models import Estacionamiento, CuposEstacionamiento

##### METODO PARA GENERAR CODIGOS #####
from .generador_codigos import generar_codigos

###### IMPORTACIÓN CÓDIGOS DE ESTADOS ######
from rest_framework import status

#### Auth #####
from rest_framework.permissions import IsAuthenticated

#### METODO PARA VALIDAD POR PK  ####
def validation_user(pk):
    try:
        return Usuarios.objects.get(id=pk)
    except Usuarios.DoesNotExist:
        return None


#### GENERAR CODIGOS DE BARRA ####
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def generate_code(request, pk=None):
    # VALIDACIÓN DE USUARIO
    user = validation_user(pk)
    if user is None:
        return Response({'error': 'Usuario no encontrado'}, status=status.HTTP_404_NOT_FOUND)

    if request.method == 'GET':   
        # VALIDACIÓN SI USUARIO TIENE CODIGOS GENERADOS ANTERIORMENTE
        if CodigosBarra.objects.filter(fk_usuario = user).exists():
            return Response({'error': 'Este usuarios ya tiene un codigo asiganado'}, status=status.HTTP_400_BAD_REQUEST)
        # GENERA CODIGO usando el RUT por el PK
        codigo_generado = generar_codigos(user.usu_rut)
        codigo_barra = CodigosBarra(
            cod_generado = codigo_generado, #Guarda los datos en el modelo CodigosBarra
            fk_usuario = user,
            cod_imagen=f'codigos_barra/codigosGen_{codigo_generado}.png'
        )

        codigo_barra.save()
        return Response({'message': '¡Se ha Generado Código de barra con exito!'}, status=status.HTTP_200_OK)

    

#### DETALLE DE CODIGO POR USUARIO ####
@api_view(['GET', 'PUT', 'DELETE'])
@permission_classes([IsAuthenticated])
def detail_code(request, pk=None):
    #VALIDACIÓN USUARIOS 
    user = validation_user(pk)
    if user is None:
        return Response({'error': 'Usuario no encontrado'}, status=status.HTTP_404_NOT_FOUND)
    
    #Lista el usuarios por el pk
    if request.method == 'GET':
        try:
            codigo_barra = CodigosBarra.objects.get(fk_usuario=user)
            serializer = CodigoBarraSerializer(codigo_barra)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except CodigosBarra.DoesNotExist:
            return Response({'error': 'No se encontró el código de barra asociado a este usuario'}, status=status.HTTP_404_NOT_FOUND)
    
    # Modifica solo agregar imagen
    if request.method == 'PUT':
        #Valida si existe un codigo asociado con un usuario
        try:
            codigo_barra = CodigosBarra.objects.get(fk_usuario=user)
        except CodigosBarra.DoesNotExist:
            return Response({'error': 'No se encontró el código de barra asociado a este usuario'}, status=status.HTTP_404_NOT_FOUND)
        
        # Valida si el campo cod_imagen esta en los datos extraidos
        if 'cod_imagen' in request.data:
            codigo_barra.cod_imagen = request.data['cod_imagen']
            #GUARADA LOS CAMBIOS
            codigo_barra.save()
            return Response({'message': '¡Imagen de código de barra actualizada con éxito!'}, status=status.HTTP_200_OK)
        else:
            return Response({'error': 'Se requiere el codigo de barra para realizar la actualización'}, status=status.HTTP_400_BAD_REQUEST)

    #Elimina el codigo del usuario
    elif request.method == 'DELETE':
        #VALIDA SI EXISTE UN CODIGO RELACIONADO CON UN USUARIO
        try:
            codigo_barra = CodigosBarra.objects.get(fk_usuario=user)
            codigo_barra.delete()
            return Response({'message': '¡Código de barra eliminado con éxito!'}, status=status.HTTP_204_NO_CONTENT)
        
        except CodigosBarra.DoesNotExist:
                return Response({'error': 'No se encontró el código de barra asociado a este usuario'}, status=status.HTTP_404_NOT_FOUND)

# LISTA TODOS LOS CODIGOS
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def all_code(request):
    if request.method == 'GET':
        try: 
            # Queryset
            user = CodigosBarra.objects.all()
            serializer = CodigoBarraSerializer(user, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except:
            return Response({'error':'¡oops, hubo un problema, vuelve a intentarlo!'}, status=status.HTTP_404_NOT_FOUND)
    

### esto esta malo, porque no calcula bien los datos, sale por ejemplo  Acceso permitido. Espacios ocupados: 89, Espacios libres: 0

@api_view(['POST'])
def scan_code_bar(request):
    if request.method == 'POST':
        codigo_recibido = request.data.get('codigo', '')
        
        try:
            codigo_bd = CodigosBarra.objects.get(cod_generado=codigo_recibido)
            usuario_relacionado = codigo_bd.fk_usuario
        except CodigosBarra.DoesNotExist:
            return Response({'error': 'Acceso denegado. Código no válido.'}, status=status.HTTP_403_FORBIDDEN)

        estacionamiento = Estacionamiento.objects.first()

        if estacionamiento:
            configuracion = estacionamiento.configuracion

            tipo_usuario = usuario_relacionado.usu_tipo

            # Actualizar los cupos
            configuracion.actualizar_cupos(tipo_usuario)

            # Guardar los cambios en la base de datos
            configuracion.save()

            # Retornar la respuesta con la información actualizada
            return Response({
                'mensaje': 'Acceso permitido.',
                'cupo_funcionarios': configuracion.cupo_funcionarios,
                'cupo_estudiantes': configuracion.cupo_estudiantes,
                'cupo_visitas': configuracion.cupo_visitas
            }, status=status.HTTP_200_OK)

    return Response({'error': 'Método no permitido.'}, status=status.HTTP_405_METHOD_NOT_ALLOWED)