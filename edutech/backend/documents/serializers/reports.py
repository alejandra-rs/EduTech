from rest_framework import serializers
from users.models import Student
from users.serializers import StudentSerializer
from ..models import Report, ReportReason, ReportResolution, CommentReport
from ..models.post import Post


class ReportReasonSerializer(serializers.ModelSerializer):
    class Meta:
        model = ReportReason
        fields = ["id", "reason"]


class PostInReportSerializer(serializers.ModelSerializer):
    course_name = serializers.CharField(source="course.name", read_only=True)
    year_id = serializers.IntegerField(source="course.year_id", read_only=True)

    class Meta:
        model = Post
        fields = ["id", "title", "post_type", "course", "course_name", "year_id"]


class ReportResolutionSerializer(serializers.ModelSerializer):
    resolved_by = StudentSerializer(read_only=True)
    resolved_by_id = serializers.PrimaryKeyRelatedField(
        write_only=True, source="resolved_by", queryset=Student.objects.all()
    )

    class Meta:
        model = ReportResolution
        fields = ["id", "message", "created_at", "resolved_by", "resolved_by_id"]
        read_only_fields = ["id", "created_at"]


class ReportSerializer(serializers.ModelSerializer):
    reason = ReportReasonSerializer(read_only=True)
    user = StudentSerializer(read_only=True)
    post = PostInReportSerializer(read_only=True)
    resolution = ReportResolutionSerializer(read_only=True)

    class Meta:
        model = Report
        fields = [
            "id",
            "reason",
            "description",
            "created_at",
            "user",
            "post",
            "resolution",
        ]


class CommentReportSerializer(serializers.ModelSerializer):
    reason = ReportReasonSerializer(read_only=True)
    user = StudentSerializer(read_only=True)

    class Meta:
        model = CommentReport
        fields = ["id", "reason", "description", "created_at", "user", "comment"]
