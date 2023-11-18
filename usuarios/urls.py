from django.urls import path
from .views import register_user, user_detail

urlpatterns = [
    ## GET & POST ##
    path('usuarios/', register_user, name='register_user'),
    ## GET, PUT, DELETE ##
    path('usuario/<int:pk>/', user_detail, name='user_detail'),

]
