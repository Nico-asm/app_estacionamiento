###### REST FRAMEWORK ######
from rest_framework.decorators import api_view
from rest_framework.response import Response

###### IMPORTACIÓN SERIALIZERS ######
from .serializers import CodigoBarraSerializer, GenerarCodigoSerializer

###### IMPORTACIÓN MODELOS ######
from usuarios.models import Usuarios
from .models import CodigosBarra

##### IMPORTACIÓN VIEWS #####
from usuarios.views import user_detail

##### METODO PARA GENERAR CODIGOS #####
from .generador_codigos import generar_codigos

###### IMPORTACIÓN CÓDIGOS DE ESTADOS ######
from rest_framework import status

# Create your views here.
@api_view(['GET'])
def generate_code(request, pk=None):

    # VALIDACIÓN DE USUARIO
    if request.method == 'GET':
        try:
            user = Usuarios.objects.get(id=pk)
        except Usuarios.DoesNotExist:
            return Response({'error': 'Usuario no encontrado'}, status=status.HTTP_404_NOT_FOUND)
        
        # VALIDACIÓN SI USUARIO TIENE CODIGOS GENERADOS ANTERIORMENTE
        if CodigosBarra.objects.filter(fk_usuario = user).exists():
            return Response({'error': 'Este usuarios ya tiene un codigo asiganado'}, status=status.HTTP_400_BAD_REQUEST)

        # GENERA CODIGO usando el RUT por el PK
        codigo_generado = generar_codigos(user.usu_rut)

        codigo_barra = CodigosBarra(
            cod_generado = codigo_generado, #Guarda los datos en el modelo CodigosBarra
            fk_usuario = user
        )
        codigo_barra.save()
        serializer = CodigoBarraSerializer(codigo_barra)

        return Response({'message': '¡Se ha Generado Código de barra con exito!'}, status=status.HTTP_200_OK) 