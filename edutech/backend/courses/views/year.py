from rest_framework import generics
from ..models import Year
from ..serializers import YearSerializer


class YearListCreate(generics.ListCreateAPIView):
    queryset = Year.objects.all()
    serializer_class = YearSerializer
