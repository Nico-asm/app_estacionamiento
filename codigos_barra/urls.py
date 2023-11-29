from django.urls import path
from .views import generate_code, all_code, detail_code, scan_code_bar
urlpatterns = [
    ## GET ##
    path('generar-codigo/<int:pk>/', generate_code, name='Generate Code'),
    ## GET ALL ##
    path('codigos-barra/', all_code, name='all code'),
    ## GET, PUT, DELETE ##
    path('detalle-codigo/<int:pk>/', detail_code, name='detal code'),
    ## POST ##
    path('leer-codigo/', scan_code_bar, name='escanear_codigos'),

]