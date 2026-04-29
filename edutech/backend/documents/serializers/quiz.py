from rest_framework import serializers
from courses.models import Course
from users.models import Student
from ..models import Quiz, Question, Answer


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


class QuizResponseSerializer(serializers.Serializer):
    question = serializers.PrimaryKeyRelatedField(queryset=Question.objects.all())
    selected = serializers.ListField(
        child=serializers.PrimaryKeyRelatedField(queryset=Answer.objects.all())
    )


class QuizCheckSerializer(serializers.Serializer):
    responses = QuizResponseSerializer(many=True)
