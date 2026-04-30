from django.urls import path
from .views import StudentView, StudentListView, IsAdminView

urlpatterns = [
    path("<int:pk>/", StudentView.as_view()),
    path("<int:pk>/is-admin/", IsAdminView.as_view(), name="is_admin"),
    path("post/", StudentView.as_view(), name="create_student"),
    path("", StudentListView.as_view(), name="list_students"),
]
