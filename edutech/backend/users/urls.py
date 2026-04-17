from django.urls import path
from .views import StudentView, StudentListView

urlpatterns = [
    path("<int:pk>/", StudentView.as_view()),
    path("post/", StudentView.as_view(), name="create_student"),
    path("", StudentListView.as_view(), name="list_students"),
]
