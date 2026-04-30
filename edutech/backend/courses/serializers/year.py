from rest_framework import serializers

from .degree import DegreeSerializer
from ..models import Year


class YearSerializer(serializers.ModelSerializer):

    class Meta:
        model = Year
        fields = ["id", "year", "degree"]