from rest_framework import serializers

from ..models import Degree


class DegreeSerializer(serializers.ModelSerializer):
    university_name = serializers.CharField(source="university.name", read_only=True)

    class Meta:
        model = Degree
        fields = ["id", "name", "university", "university_name"]
