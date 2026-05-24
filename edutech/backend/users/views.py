from rest_framework import generics, views, status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from django.shortcuts import get_object_or_404
from .models import Student
from .serializers import StudentSerializer


class StudentListView(generics.ListAPIView):
    permission_classes = [IsAuthenticated]
    queryset = Student.objects.all()
    serializer_class = StudentSerializer
    filterset_fields = ["email"]


class StudentView(views.APIView):
    def get_permissions(self):
        if self.request.method == "POST":
            return [AllowAny()]
        return [IsAuthenticated()]

    def post(self, request):
        serializer = StudentSerializer(data=request.data, context={"request": request})
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class StudentMeView(views.APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        student = get_object_or_404(Student, email=request.user.email)
        return Response(StudentSerializer(student, context={"request": request}).data)

    def patch(self, request):
        student = get_object_or_404(Student, email=request.user.email)
        if "degree" in request.data:
            student.degree.set(request.data["degree"])
        return Response({}, status=status.HTTP_200_OK)

    def delete(self, request):
        student = get_object_or_404(Student, email=request.user.email)
        student.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


class IsAdminMeView(views.APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        student = get_object_or_404(Student, email=request.user.email)
        return Response({"is_admin": student.is_admin})
