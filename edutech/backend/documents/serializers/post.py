from rest_framework import serializers
from users.serializers import StudentSerializer
from ..models import Post
from .attachments import PDFAttachmentSerializer, YoutubeVideoSerializer
from .quiz import QuizSerializer, QuizPreviewSerializer
from .flashcard import FlashCardDeckSerializer, FlashCardDeckPreviewSerializer


class PostPreviewSerializer(serializers.ModelSerializer):
    pdf = PDFAttachmentSerializer(read_only=True)
    vid = YoutubeVideoSerializer(read_only=True)
    qui = QuizPreviewSerializer(read_only=True)
    fla = FlashCardDeckPreviewSerializer(read_only=True)
    likes = serializers.SerializerMethodField()
    dislikes = serializers.SerializerMethodField()
    year = serializers.IntegerField(source="course.year.id", read_only=True)

    def get_likes(self, obj):
        return obj.like_set.count()

    def get_dislikes(self, obj):
        return obj.dislike_set.count()

    class Meta:
        model = Post
        fields = [
            "id",
            "title",
            "post_type",
            "created_at",
            "course",
            "year",
            "pdf",
            "vid",
            "qui",
            "fla",
            "views",
            "likes",
            "dislikes",
        ]


class PostSerializer(serializers.ModelSerializer):
    pdf = PDFAttachmentSerializer(read_only=True)
    vid = YoutubeVideoSerializer(read_only=True)
    qui = QuizSerializer(read_only=True)
    fla = FlashCardDeckSerializer(read_only=True)
    student = StudentSerializer(read_only=True)

    class Meta:
        model = Post
        fields = [
            "id",
            "title",
            "description",
            "post_type",
            "course",
            "student",
            "created_at",
            "pdf",
            "vid",
            "qui",
            "fla",
            "views",
        ]
