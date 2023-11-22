from django.urls import path
from .views import generate_code, all_code, detail_code
urlpatterns = [
    ## GET ##
    path('generarcodigo/<int:pk>/', generate_code, name='Generate Code'),
    ## GET ALL ##
    path('codigosbarra/', all_code, name='all code'),
    ## PUT, DELETE ##
    path('detallecodigo/<int:pk>/', detail_code, name='detal code'),

]