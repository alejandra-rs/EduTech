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
    def get(self, request, pk):
        try:
            student = Student.objects.get(pk=pk)
        except Student.DoesNotExist:
            return Response({"error": "Estudiante no encontrado"}, status=status.HTTP_404_NOT_FOUND)

        serializer = StudentSerializer(student, context={"request": request})
        return Response(serializer.data, status=status.HTTP_200_OK)

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


    def patch(self, request, pk):
        try:
            student = Student.objects.get(pk=pk)
        except Student.DoesNotExist:
            return Response({"error": "Estudiante no encontrado"}, status=status.HTTP_404_NOT_FOUND)

        if "degree" in request.data:
            student.degree.set(request.data["degree"])
        return Response(
            {},
            status=status.HTTP_200_OK
        )

class IsAdminView(views.APIView):
    def get(self, request, pk):
        student = get_object_or_404(Student, pk=pk)
        return Response({"is_admin": student.is_admin})