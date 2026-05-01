from rest_framework import serializers
from ..models import Subscription
from .courses import CourseSerializer


class SubscriptionSerializer(serializers.ModelSerializer):
    course = CourseSerializer(read_only=True)

    class Meta:
        model = Subscription
        fields = ["id", "user", "course"]
