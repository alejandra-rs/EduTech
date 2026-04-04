from django.urls import path
from . import views

urlpatterns = [
    path('years/', views.YearListCreate.as_view(), name='list_years'),
    path('sub/', views.SubscriptionView.as_view(), name='subscription'),
    path('sub/<int:pk>', views.SubscriptionView.as_view(), name='sub_delete'),
    path('', views.CourseListCreate.as_view(), name='list_courses'),
]
