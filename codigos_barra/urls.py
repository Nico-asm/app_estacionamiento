from django.urls import path
from .views import generate_code, all_code, detail_code, scan_code_bar
urlpatterns = [
    ## GET ##
    path('generarcodigo/<int:pk>/', generate_code, name='Generate Code'),
    ## GET ALL ##
    path('codigosbarra/', all_code, name='all code'),
    ## GET, PUT, DELETE ##
    path('detallecodigo/<int:pk>/', detail_code, name='detal code'),
    ## POST ##
    path('leercodigo/', scan_code_bar, name='escanear_codigos'),

]