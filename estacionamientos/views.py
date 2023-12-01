from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .models import CuposEstacionamiento, Estacionamiento
from .serializers import CupoEstacionamientoSerializer

@api_view(['GET', 'POST', 'PUT'])
def config_parking(request):
    if request.method == 'GET':
        cupos_estacionamiento = CuposEstacionamiento.objects.first()

        if cupos_estacionamiento:
            serializer = CupoEstacionamientoSerializer(cupos_estacionamiento)
            return Response(serializer.data)
        else:
            return Response({'message': 'No hay objetos de CuposEstacionamiento en la base de datos.'}, status=status.HTTP_200_OK)
    elif request.method == 'POST':
        serializer = CupoEstacionamientoSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    elif request.method == 'PUT':
        cupos_estacionamiento = CuposEstacionamiento.objects.first()
        if cupos_estacionamiento:
            serializer = CupoEstacionamientoSerializer(cupos_estacionamiento, data=request.data)

            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        else:
            return Response({'message': 'No Hay registro de CuposEstacionamiento en la base de datos.'}, status=status.HTTP_404_NOT_FOUND)
        

@api_view(['POST'])
def create_parking(request):
    if request.method == 'POST':
        # Puedes recibir la configuración de cupos en el cuerpo de la solicitud
        serializer = CupoEstacionamientoSerializer(data=request.data)

        if serializer.is_valid():
            # Guarda la configuración de cupos
            configuracion = serializer.save()

            # Crea un objeto Estacionamiento asociado al objeto CuposEstacionamiento
            Estacionamiento.objects.create(configuracion=configuracion)

            return Response({'message': 'Estacionamiento creado correctamente.'}, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    return Response({'error': 'Método no permitido.'}, status=status.HTTP_405_METHOD_NOT_ALLOWED)