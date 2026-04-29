from rest_framework import serializers
from courses.models import Course
from courses.serializers import CourseSerializer
from users.models import Student
from ..models import Post
from .quiz import QuizSerializer
from .flashcard import FlashCardDeckSerializer


class DraftPostSerializer(serializers.ModelSerializer):
    fla = FlashCardDeckSerializer(read_only=True)
    qui = QuizSerializer(read_only=True)
    course = CourseSerializer(read_only=True)

    class Meta:
        model = Post
        fields = [
            "id",
            "title",
            "description",
            "post_type",
            "course",
            "created_at",
            "updated_at",
            "fla",
            "qui",
        ]


class DraftCardInputSerializer(serializers.Serializer):
    question = serializers.CharField(allow_blank=True)
    answer = serializers.CharField(allow_blank=True)


class DraftAnswerInputSerializer(serializers.Serializer):
    text = serializers.CharField(allow_blank=True)
    is_correct = serializers.BooleanField()


class DraftQuestionInputSerializer(serializers.Serializer):
    title = serializers.CharField(allow_blank=True)
    answers = DraftAnswerInputSerializer(many=True, allow_empty=True)


class DraftCreateSerializer(serializers.Serializer):
    student = serializers.PrimaryKeyRelatedField(queryset=Student.objects.all())
    course = serializers.PrimaryKeyRelatedField(queryset=Course.objects.all())
    post_type = serializers.ChoiceField(choices=["QUI", "FLA"])
    title = serializers.CharField(max_length=200)
    description = serializers.CharField(allow_blank=True)
    cards = DraftCardInputSerializer(
        many=True, required=False, allow_empty=True, default=list
    )
    questions = DraftQuestionInputSerializer(
        many=True, required=False, allow_empty=True, default=list
    )


class DraftUpdateSerializer(serializers.Serializer):
    title = serializers.CharField(max_length=200)
    description = serializers.CharField(allow_blank=True)
    cards = DraftCardInputSerializer(
        many=True, required=False, allow_empty=True, default=list
    )
    questions = DraftQuestionInputSerializer(
        many=True, required=False, allow_empty=True, default=list
    )
