from rest_framework import serializers
from .models import Post, PDFAttachment, YoutubeVideo, Comment, Like, Dislike
from .models import Quiz, Question, Answer, FlashCardDeck, FlashCard
from courses.models import Course
from courses.serializers import CourseSerializer
from users.models import Student
from users.serializers import StudentSerializer
import urllib.request
import urllib.parse


class PDFAttachmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = PDFAttachment
        fields = ["id", "file"]


class YoutubeVideoSerializer(serializers.ModelSerializer):
    class Meta:
        model = YoutubeVideo
        fields = ["id", "vid"]


class AnswerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Answer
        fields = ["id", "text", "is_correct"]


class QuestionSerializer(serializers.ModelSerializer):
    answers = AnswerSerializer(many=True, read_only=True)

    class Meta:
        model = Question
        fields = ["id", "title", "answers"]


class QuizSerializer(serializers.ModelSerializer):
    questions = QuestionSerializer(many=True, read_only=True)

    class Meta:
        model = Quiz
        fields = ["id", "questions"]


class QuizPreviewSerializer(serializers.ModelSerializer):
    question_count = serializers.IntegerField(source="questions.count", read_only=True)

    class Meta:
        model = Quiz
        fields = ["id", "question_count"]


class FlashCardSerializer(serializers.ModelSerializer):
    class Meta:
        model = FlashCard
        fields = ["id", "question", "answer"]


class FlashCardDeckSerializer(serializers.ModelSerializer):
    cards = FlashCardSerializer(many=True, read_only=True)

    class Meta:
        model = FlashCardDeck
        fields = ["id", "cards"]


class FlashCardDeckPreviewSerializer(serializers.ModelSerializer):
    card_count = serializers.IntegerField(source="cards.count", read_only=True)

    class Meta:
        model = FlashCardDeck
        fields = ["id", "card_count"]


class CommentListSerializer(serializers.ModelSerializer):
    user = StudentSerializer(read_only=True)

    class Meta:
        model = Comment
        fields = ["id", "message", "user", "created_at"]


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


class PDFUploadSerializer(serializers.Serializer):
    title = serializers.CharField(max_length=200)
    description = serializers.CharField()
    course = serializers.PrimaryKeyRelatedField(queryset=Course.objects.all())
    student = serializers.PrimaryKeyRelatedField(
        queryset=Student.objects.all(), required=False, allow_null=True
    )
    file = serializers.FileField()

    def validate(self, data):
        validity_test = PDFAttachment(file=data["file"])
        validity_test.full_clean(exclude=["post"])
        return data


class VideoUploadSerializer(serializers.Serializer):
    title = serializers.CharField(max_length=200)
    description = serializers.CharField()
    course = serializers.PrimaryKeyRelatedField(queryset=Course.objects.all())
    student = serializers.PrimaryKeyRelatedField(
        queryset=Student.objects.all(), required=False, allow_null=True
    )
    file = serializers.URLField()

    def validate_file(self, video):
        oembed_url = (
            "https://www.youtube.com/oembed?format=json&url="
            + urllib.parse.quote(video)
        )
        try:
            with urllib.request.urlopen(oembed_url):
                return video
        except Exception:
            raise serializers.ValidationError(
                "El vídeo de YouTube no existe o no es válido."
            )


class AnswerUploadSerializer(serializers.Serializer):
    text = serializers.CharField(max_length=500)
    is_correct = serializers.BooleanField()


class QuestionUploadSerializer(serializers.Serializer):
    title = serializers.CharField(max_length=500)
    answers = AnswerUploadSerializer(many=True)

    def validate_answers(self, answers):
        if len(answers) < 2:
            raise serializers.ValidationError(
                "Cada pregunta necesita al menos 2 respuestas."
            )
        if not any(a["is_correct"] for a in answers):
            raise serializers.ValidationError(
                "Cada pregunta necesita al menos una respuesta correcta."
            )
        return answers


class QuizUploadSerializer(serializers.Serializer):
    title = serializers.CharField(max_length=200)
    description = serializers.CharField(allow_blank=True)
    course = serializers.PrimaryKeyRelatedField(queryset=Course.objects.all())
    student = serializers.PrimaryKeyRelatedField(
        queryset=Student.objects.all(), required=False, allow_null=True
    )
    questions = QuestionUploadSerializer(many=True)

    def validate_questions(self, questions):
        if not questions:
            raise serializers.ValidationError(
                "El cuestionario necesita al menos una pregunta."
            )
        return questions


class FlashCardUploadSerializer(serializers.Serializer):
    question = serializers.CharField()
    answer = serializers.CharField()


class FlashCardDeckUploadSerializer(serializers.Serializer):
    title = serializers.CharField(max_length=200)
    description = serializers.CharField(allow_blank=True)
    course = serializers.PrimaryKeyRelatedField(queryset=Course.objects.all())
    student = serializers.PrimaryKeyRelatedField(
        queryset=Student.objects.all(), required=False, allow_null=True
    )
    cards = FlashCardUploadSerializer(many=True)

    def validate_cards(self, cards):
        if not cards:
            raise serializers.ValidationError(
                "El grupo de flashcards necesita al menos una tarjeta."
            )
        return cards


class QuizResponseSerializer(serializers.Serializer):
    question = serializers.PrimaryKeyRelatedField(queryset=Question.objects.all())
    selected = serializers.ListField(
        child=serializers.PrimaryKeyRelatedField(queryset=Answer.objects.all())
    )


class QuizCheckSerializer(serializers.Serializer):
    responses = QuizResponseSerializer(many=True)


class LikeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Like
        fields = ["user", "post"]


class DislikeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Dislike
        fields = ["user", "post"]


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
