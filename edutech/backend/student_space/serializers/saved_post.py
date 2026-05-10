from rest_framework import serializers
from documents.serializers import PostPreviewSerializer
from ..models import SavedPost


class SavedPostSerializer(serializers.ModelSerializer):
    post = PostPreviewSerializer(read_only=True)

    class Meta:
        model = SavedPost
        fields = ["id", "post", "saved_at", "is_pinned", "pinned_at"]


class SavedPostCreateSerializer(serializers.Serializer):
    folder_id = serializers.IntegerField()
    post_id = serializers.IntegerField()
    student_id = serializers.IntegerField()


class SavedPostUpdateSerializer(serializers.Serializer):
    is_pinned = serializers.BooleanField()
