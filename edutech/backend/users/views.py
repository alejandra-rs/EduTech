from rest_framework import generics, views, status
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from .models import Student
from .serializers import StudentSerializer


class StudentListView(generics.ListAPIView):
    queryset = Student.objects.all()
    serializer_class = StudentSerializer
    filterset_fields = ["email"]


class StudentView(views.APIView):
    def post(self, request):
        student = Student.objects.create(
            first_name=request.data["first_name"],
            last_name=request.data["last_name"],
            email=request.data["email"],
            picture=request.FILES.get("picture"),
            password="x",
        )
        return Response(
            StudentSerializer(student, context={"request": request}).data,
            status=status.HTTP_201_CREATED,
        )

    def delete(self, request, pk):
        student = get_object_or_404(Student, pk=pk)
        student.delete()
        return Response()


class IsAdminView(views.APIView):
    def get(self, request, pk):
        student = get_object_or_404(Student, pk=pk)
        return Response({"is_admin": student.is_admin})
