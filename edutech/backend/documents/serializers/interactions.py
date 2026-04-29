from rest_framework import serializers
from users.serializers import StudentSerializer
from ..models import Comment, Like, Dislike


class CommentListSerializer(serializers.ModelSerializer):
    user = StudentSerializer(read_only=True)

    class Meta:
        model = Comment
        fields = ["id", "message", "user", "created_at"]


class LikeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Like
        fields = ["user", "post"]


class DislikeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Dislike
        fields = ["user", "post"]
