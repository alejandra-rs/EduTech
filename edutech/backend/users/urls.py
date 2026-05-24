from django.urls import path
from .views import StudentView, StudentListView, StudentMeView, IsAdminMeView

urlpatterns = [
    path("me/", StudentMeView.as_view(), name="student_me"),
    path("me/is-admin/", IsAdminMeView.as_view(), name="is_admin_me"),
    path("post/", StudentView.as_view(), name="create_student"),
    path("", StudentListView.as_view(), name="list_students"),
]
