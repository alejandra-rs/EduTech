from django.shortcuts import get_object_or_404
from rest_framework import views
from rest_framework.permissions import IsAuthenticated

from .models import Student


class AuthStudentView(views.APIView):
    permission_classes = [IsAuthenticated]

    def get_student(self):
        if not hasattr(self.request, "_student"):
            self.request._student = get_object_or_404(
                Student, email=self.request.user.email
            )
        return self.request._student
