from rest_framework import serializers
from courses.models import Course
from users.models import Student
from ..models import FlashCardDeck, FlashCard


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
