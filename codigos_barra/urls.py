from django.urls import path
from .views import generate_code, all_code, detail_code, scan_code_bar, view_code_bar, download_image
urlpatterns = [
    ## GET ##
    path('generar-codigo/<int:pk>/', generate_code, name='generate_codigo'),
    ## GET ##
    path('codigos-barra/', all_code, name='codigos-barra'),
    ## GET, PUT, DELETE ##
    path('detalle-codigo/<int:pk>/', detail_code, name='detalle_codigo'),
    ## POST ##
    path('leer-codigo/', scan_code_bar, name='leer_codigo'),
    
    path('ver-imagen/<int:pk>', view_code_bar, name='ver_imagen'),

    path('descargar-imagen/<int:pk>/', download_image, name='descargar_imagen'),

]
