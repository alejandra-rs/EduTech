from rest_framework import serializers
from ..models import PDFRevisionNote


class RevisionNoteSerializer(serializers.ModelSerializer):
    post_id = serializers.IntegerField(source="attachment.post.id", read_only=True)
    title = serializers.CharField(source="attachment.post.title", read_only=True)
    course_id = serializers.IntegerField(source="attachment.post.course.id", read_only=True)
    year_id = serializers.IntegerField(source="attachment.post.course.year_id", read_only=True)

    class Meta:
        model = PDFRevisionNote
        fields = ["id", "post_id", "title", "reason", "created_at", "course_id", "year_id"]
