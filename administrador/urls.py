from django.urls import path
from .views import register_admin, admin_login, admin_logout, admin_detail

urlpatterns = [
    path('registroAdmin/', register_admin, name='register_admin'),
    path('iniciarsesion/', admin_login, name='login'),
    path('cerrarsesion/', admin_logout, name='logout'),

    path('administrador/<int:pk>/', admin_detail, name='admin_detail'),
]
