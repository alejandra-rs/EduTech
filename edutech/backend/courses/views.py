from rest_framework import generics
from django.shortcuts import get_object_or_404
from .models import Course, Year
from .serializers import CourseSerializer, YearSerializer

class YearListCreate(generics.ListCreateAPIView):
    queryset = Year.objects.all()
    serializer_class = YearSerializer

class CourseListCreate(generics.ListCreateAPIView):
    queryset = Course.objects.all()
    serializer_class = CourseSerializer
    filterset_fields = ['year']

    def list(self, request, *args, **kwargs):
        year_id = request.query_params.get('year')
        if year_id is not None:
            get_object_or_404(Year, pk=year_id)
        return super().list(request, *args, **kwargs)