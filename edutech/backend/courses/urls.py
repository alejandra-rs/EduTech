from django.urls import path
from . import views

urlpatterns = [
    path("<int:pk>/", views.CourseDetailView.as_view(), name="course_detail"),
    path("years/", views.YearListCreate.as_view(), name="list_years"),
    path("sub/", views.SubscriptionView.as_view(), name="subscription"),
    path("sub/<int:pk>", views.SubscriptionView.as_view(), name="sub_delete"),
    path("universities/", views.UniversityListCreate.as_view(), name="list_universities"),
    path("universities/<int:pk>/", views.UniversityDetail.as_view(), name='university-detail'),
    path("degree/", views.DegreeListCreate.as_view(), name="list_degree"),
    path("", views.CourseListCreate.as_view(), name="list_courses"),
]
