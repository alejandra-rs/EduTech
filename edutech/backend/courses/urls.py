from django.urls import path
from . import views

urlpatterns = [
    # Esta ruta captura el nombre de la asignatura de la URL
    path('<str:subject>/', views.subject, name='subject'),
]