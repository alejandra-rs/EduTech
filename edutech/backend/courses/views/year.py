from django.core.serializers import serialize
from rest_framework import views, status
from rest_framework.generics import get_object_or_404
from rest_framework.response import Response

from ..models import Year
from ..serializers import YearSerializer


class YearDetailView(views.APIView):
    def get(self, request, pk):
        year = get_object_or_404(Year, pk=pk)
        serializer = YearSerializer(year)
        return Response(serializer.data, status=status.HTTP_200_OK)

class UserYearListView(views.APIView):
    def get(self, request):
        user_id = request.query_params.get("user")

        if user_id not in [None, "undefined", ""]:
            queryset = Year.objects.filter(degree__student__id=user_id).distinct()
        else:
            queryset = Year.objects.all()

        serializer = YearSerializer(queryset, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request):
        serializer = YearSerializer(data=request.data)

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
