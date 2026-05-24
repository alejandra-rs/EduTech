from rest_framework import views, status
from rest_framework.generics import get_object_or_404
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated

from ..models import Year
from ..serializers import YearSerializer
from users.models import Student


class YearDetailView(views.APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, pk):
        year = get_object_or_404(Year, pk=pk)
        serializer = YearSerializer(year)
        return Response(serializer.data, status=status.HTTP_200_OK)


class UserYearListView(views.APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        student = get_object_or_404(Student, email=request.user.email)
        queryset = Year.objects.filter(degree__student=student).distinct()
        serializer = YearSerializer(queryset, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request):
        serializer = YearSerializer(data=request.data)

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
