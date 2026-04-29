from rest_framework import serializers

from .degree import DegreeSerializer
from ..models import Year


class YearSerializer(serializers.ModelSerializer):

    degree_data = DegreeSerializer(source="degree", read_only=True)
    class Meta:
        model = Year
        fields = ["id", "year", "degree", "degree_data"]