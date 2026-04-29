from rest_framework import serializers

from .university import UniversitySerializer
from ..models import Degree

class DegreeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Degree
        fields = ["id", "name", "university"]