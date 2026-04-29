from rest_framework import serializers

from .university import UniversitySerializer
from ..models import Degree

class DegreeSerializer(serializers.ModelSerializer):

    university_data = UniversitySerializer(source="university", read_only=True)
    class Meta:
        model = Degree
        fields = ["id", "name", "university", "university_data"]