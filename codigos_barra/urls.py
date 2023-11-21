from django.urls import path
from .views import generate_code
urlpatterns = [
    ## GET ##
    path('generarcodigo/<int:pk>/', generate_code, name='Generate Code'),

]