from django.urls import path
from .views import create_report

urlpatterns = [
    # GET, POST #
    path('reportes/', create_report, name='create_report'),
]