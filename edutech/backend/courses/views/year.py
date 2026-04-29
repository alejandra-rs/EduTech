from rest_framework import generics, views
from rest_framework.response import Response

from ..models import Year
from ..serializers import YearSerializer


class YearListCreate(generics.ListCreateAPIView):
    queryset = Year.objects.all()
    serializer_class = YearSerializer

class UserYearListView(views.APIView):
        serializer_class = YearSerializer

        def get(self, request):
            user_id = request.query_params.get("user")

            if user_id is not None:
                queryset = Year.objects.filter(
                    degree__student__id=user_id
                ).distinct()
            else:
                queryset = Year.objects.all()
            serializer = YearSerializer(queryset, many=True)

            return Response(serializer.data)
