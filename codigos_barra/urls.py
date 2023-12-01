from django.urls import path
from .views import generate_code, all_code, detail_code, scan_code_bar
urlpatterns = [
    ## GET ##
    path('generar-codigo/<int:pk>/', generate_code, name='generate-codigo'),
    ## GET ##
    path('codigos-barra/', all_code, name='codigos-barra'),
    ## GET, PUT, DELETE ##
    path('detalle-codigo/<int:pk>/', detail_code, name='detalle-codigo'),
    ## POST ##
    path('leer-codigo/', scan_code_bar, name='leer-codigo'),

]