from django.shortcuts import render
from rest_framework import generics, views, status
from rest_framework.response import Response
from .models import Student
from .serializers import StudentSerializer


class StudentListView(generics.ListAPIView):
    queryset = Student.objects.all()
    serializer_class = StudentSerializer
    filterset_fields = ['email']


class StudentView(views.APIView):
    def post(self, request):
        print(request.data)

        student = Student.objects.create(
            first_name=request.data['first_name'],
            last_name=request.data['last_name'],
            email=request.data['email'],
            picture=request.FILES.get('picture'),
            password='x'
        )

        return Response(StudentSerializer(student, context={'request': request}).data, status=status.HTTP_201_CREATED)

    def delete(self, request, pk):
        student = Student.objects.get(pk=pk)
        student.delete()
        return Response()