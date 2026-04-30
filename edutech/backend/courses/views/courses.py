from rest_framework import generics, views
from rest_framework.response import Response
from rest_framework import status
from django.shortcuts import get_object_or_404
from ..serializers import CourseSerializer
from ..models import Course, Year


class CourseListCreate(generics.ListCreateAPIView):
    queryset = Course.objects.all()
    serializer_class = CourseSerializer
    filterset_fields = ["year", "semester"]

    def list(self, request, *args, **kwargs):
        year_id = request.query_params.get("year")
        if year_id is not None:
            get_object_or_404(Year, pk=year_id)
        return super().list(request, *args, **kwargs)


class CourseDetailView(views.APIView):
    def get(self, request, pk):
        course = get_object_or_404(Course, pk=pk)
        return Response(CourseSerializer(course).data, status=status.HTTP_200_OK)
