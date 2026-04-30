from rest_framework import generics

from ..serializers import DegreeSerializer
from ..models import Degree


class DegreeListCreate(generics.ListCreateAPIView):
    queryset = Degree.objects.all()
    serializer_class = DegreeSerializer
