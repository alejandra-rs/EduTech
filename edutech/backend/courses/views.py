from rest_framework import generics
from .models import Course, Year
from .serializers import CourseSerializer, YearSerializer

class YearListCreate(generics.ListCreateAPIView):
    queryset = Year.objects.all()
    serializer_class = YearSerializer

class CourseListCreate(generics.ListCreateAPIView):
    queryset = Course.objects.all()
    serializer_class = CourseSerializer