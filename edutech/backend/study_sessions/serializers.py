from rest_framework import serializers

from courses.models import Course
from courses.serializers import CourseSerializer
from users.models import Student
from users.serializers import StudentSerializer

from .models import StudySession, StudySessionComment


class StudySessionCommentSerializer(serializers.ModelSerializer):
    student = StudentSerializer(read_only=True)
    student_id = serializers.PrimaryKeyRelatedField(
        write_only=True, source="student", queryset=Student.objects.all()
    )

    class Meta:
        model = StudySessionComment
        fields = ["id", "student", "student_id", "message", "created_at"]
        read_only_fields = ["id", "created_at"]


class StudySessionSerializer(serializers.ModelSerializer):
    creator = StudentSerializer(read_only=True)
    creator_id = serializers.PrimaryKeyRelatedField(
        write_only=True, source="creator", queryset=Student.objects.all()
    )
    course = CourseSerializer(read_only=True)
    course_id = serializers.PrimaryKeyRelatedField(
        write_only=True,
        source="course",
        queryset=Course.objects.all(),
        required=False,
        allow_null=True,
    )
    participants = serializers.PrimaryKeyRelatedField(many=True, read_only=True)
    is_starred = serializers.SerializerMethodField()

    class Meta:
        model = StudySession
        fields = [
            "id",
            "title",
            "description",
            "scheduled_at",
            "created_at",
            "creator",
            "creator_id",
            "course",
            "course_id",
            "participants",
            "is_starred",
            "twitch_link",
            "stream_task_id",
        ]
        read_only_fields = ["id", "created_at", "stream_task_id"]

    def get_is_starred(self, obj):
        try:
            student_id = int(self.context.get("student_id"))
        except (TypeError, ValueError):
            return False
        return obj.participants.filter(pk=student_id).exists()
