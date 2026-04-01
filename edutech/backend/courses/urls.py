from django.urls import path
from . import views

urlpatterns = [
    path('years/', views.YearListCreate.as_view(), name='list_years'),
    path('', views.CourseListCreate.as_view(), name='list_courses'),
]