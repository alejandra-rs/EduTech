from rest_framework import generics
from rest_framework.permissions import IsAuthenticated

from ..serializers import DegreeSerializer
from ..models import Degree


class DegreeListCreate(generics.ListCreateAPIView):
    permission_classes = [IsAuthenticated]
    queryset = Degree.objects.all()
    serializer_class = DegreeSerializer
    filterset_fields = ["university", "id"]
