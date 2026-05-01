from rest_framework import serializers
from rest_framework.validators import UniqueTogetherValidator
from ..models import Course, Year
from .year import YearSerializer


class CourseSerializer(serializers.ModelSerializer):
    year = YearSerializer(read_only=True)
    year_id = serializers.PrimaryKeyRelatedField(
        queryset=Year.objects.all(), source="year", write_only=True
    )

    class Meta:
        model = Course
        fields = ["id", "name", "year", "year_id", "semester"]
        validators = [
            UniqueTogetherValidator(
                queryset=Course.objects.all(), fields=["name", "year"]
            )
        ]
