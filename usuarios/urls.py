from django.urls import path
from .views import register_user_api, user_detail_api

urlpatterns = [
    path('usuarios/', register_user_api, name='register_user'),

    path('usuario/<int:pk>/', user_detail_api, name='user_detail'),

]
