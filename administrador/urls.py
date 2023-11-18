from django.urls import path
from .views import register_user, user_login, user_logout, user_detail

urlpatterns = [
    path('registroAdmin/', register_user, name='register_admin'),
    path('iniciarsesion/', user_login, name='login'),
    path('cerrarsesion/', user_logout, name='logout'),

    path('administrador/<int:pk>/', user_detail, name='user_admin_detail'),
]
