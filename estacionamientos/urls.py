from django.urls import path
from .views import config_parking, assign_parking

urlpatterns = [
   #Configuracion para futuros cambios al estacionamiento
    path('configuracion-estacionamiento/', config_parking, name='configuracion_estacionamiento'),

    # URL PARA CAMBIAR CUPOS , GET, POST, PUT
    path('cupos-estacionamiento/', assign_parking, name='cupos_estacionamiento'),
]