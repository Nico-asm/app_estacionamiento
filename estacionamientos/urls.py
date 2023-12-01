from django.urls import path
from .views import config_parking, create_parking

urlpatterns = [
    # Otras URLs de tu aplicación
    path('cupos-estacionamiento/', config_parking, name='cupos-estacionamiento'),
    path('crear-estacionamiento/', create_parking, name='create_parking'),
]