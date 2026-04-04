from django.shortcuts import render
from rest_framework import generics
from .models import Student
from .serializers import StudentSerializer


class StudentListView(generics.ListAPIView):
    queryset = Student.objects.all()
    serializer_class = StudentSerializer