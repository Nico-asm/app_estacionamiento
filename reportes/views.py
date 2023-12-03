from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework import status
from .models import Reportes

#### Serializers ####
from .serializers import ReporteSerializer

#### Auth #####
from rest_framework.permissions import IsAuthenticated
# Create your views here.

@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
def create_report(request):
    # Listar
    if request.method == 'GET':
        reports = Reportes.objects.all()
        serializer = ReporteSerializer(reports, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    # Crear
    if request.method == 'POST':
        #  aqui se Converte request.data en un diccionario mutable
        data = request.data.copy()
        
        # Asignar automáticamente el administrador actual al reporte
        data['fk_admin'] = request.user.id
        serializer = ReporteSerializer(data=data)

        if serializer.is_valid():
            serializer.save()
            return Response({'message': '¡Reporte creado correctamente!'}, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
