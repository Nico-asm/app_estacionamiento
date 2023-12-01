from django.urls import path
from .views import register_admin, admin_login, admin_logout, admin_detail

urlpatterns = [
    ## GET, POST ##
    path('registro-admin/', register_admin, name='register-admin'),
    ## POST ##
    path('iniciarsesion/', admin_login, name='login'),
    ## POST ##
    path('cerrarsesion/', admin_logout, name='logout'),
    ## GET, PATCH, DELETE ##
    path('administrador/<int:pk>/', admin_detail, name='admin-detail'),
]
