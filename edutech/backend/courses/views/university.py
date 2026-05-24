from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from ..models import University
from ..serializers import UniversitySerializer


class UniversityListCreate(generics.ListCreateAPIView):
    permission_classes = [IsAuthenticated]
    queryset = University.objects.all()
    serializer_class = UniversitySerializer


class UniversityDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = University.objects.all()
    serializer_class = UniversitySerializer
