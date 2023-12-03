from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework import status

from .models import CuposEstacionamiento, Estacionamiento

from .serializers import CupoEstacionamientoSerializer, EstacionamientoSerializer

from rest_framework.permissions import IsAuthenticated

## Esta vista en el futuro ayudaria a cambiar configuraciones del estacionamiento, como nuevos cupos, tarifas, horarios especiales etc.
@api_view(['GET', 'POST', 'PUT'])
@permission_classes([IsAuthenticated])
def config_parking(request):
    estacionamiento = Estacionamiento.objects.first()
    serializer = EstacionamientoSerializer
    #LISTA LOS CUPOS
    if request.method == 'GET':
        if estacionamiento:
            return Response(serializer(estacionamiento).data)
        else:
            return Response({'message': 'No hay objetos de Estacionamiento en la base de datos.'}, status=status.HTTP_200_OK)
    #CREA NUEVOS CUPOS
    elif request.method == 'POST':
        serializer_instance = serializer(data=request.data)
        if serializer_instance.is_valid():
            instance = serializer_instance.save()
            return Response(serializer(instance).data, status=status.HTTP_201_CREATED)
        return Response(serializer_instance.errors, status=status.HTTP_400_BAD_REQUEST)
    #EDITA LOS CUPOS
    elif request.method == 'PUT':
        if estacionamiento:
            serializer_instance = serializer(estacionamiento, data=request.data)
            if serializer_instance.is_valid():
                serializer_instance.save()
                return Response(serializer_instance.data)
            return Response(serializer_instance.errors, status=status.HTTP_400_BAD_REQUEST)
        else:
            return Response({'message': 'No hay registro de Estacionamiento en la base de datos.'}, status=status.HTTP_404_NOT_FOUND)

    return Response({'error': 'Método no permitido.'}, status=status.HTTP_405_METHOD_NOT_ALLOWED)

        
## Vista para cambio de cupos del estacionamiento.
@api_view(['GET', 'POST', 'PUT'])
def assign_parking(request):
    cupos_estacionamiento = CuposEstacionamiento.objects.first()
    serializer = CupoEstacionamientoSerializer

    if request.method == 'GET':
        if cupos_estacionamiento:
            return Response(serializer(cupos_estacionamiento).data)
        else:
            return Response({'message': 'No hay objetos de CuposEstacionamiento en la base de datos.'}, status=status.HTTP_200_OK)

    elif request.method == 'POST':
        serializer_instance = serializer(data=request.data)
        if serializer_instance.is_valid():
            instance = serializer_instance.save()
            return Response(serializer(instance).data, status=status.HTTP_201_CREATED)
        return Response(serializer_instance.errors, status=status.HTTP_400_BAD_REQUEST)

    elif request.method == 'PUT':
        if cupos_estacionamiento:
            serializer_instance = serializer(cupos_estacionamiento, data=request.data)
            if serializer_instance.is_valid():
                serializer_instance.save()
                return Response(serializer_instance.data)
            return Response(serializer_instance.errors, status=status.HTTP_400_BAD_REQUEST)
        else:
            return Response({'message': 'No hay registro de Cupos Estacionamiento en la base de datos.'}, status=status.HTTP_404_NOT_FOUND)

    return Response({'error': 'Método no permitido.'}, status=status.HTTP_405_METHOD_NOT_ALLOWED)