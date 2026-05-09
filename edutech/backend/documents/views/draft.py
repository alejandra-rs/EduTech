from django.shortcuts import get_object_or_404
from django.db import transaction
from rest_framework import views, status
from rest_framework.response import Response
from ..models.quiz import Answer
from users.models import Student
from ..models import Post, FlashCard, FlashCardDeck, Quiz
from ..serializers import (
    DraftPostSerializer,
    DraftCreateSerializer,
    DraftUpdateSerializer,
)
from ..notifications import notify_subscribers_of_new_post


def _write_flashcards(post, data):
    deck = FlashCardDeck.objects.create(post=post)
    cards_to_create = [
        FlashCard(deck=deck, question=card["question"], answer=card["answer"])
        for card in data.get("cards", [])
    ]
    FlashCard.objects.bulk_create(cards_to_create)


def _write_quiz(post, data):
    quiz = Quiz.objects.create(post=post)
    for quiz_data in data.get("questions", []):
        question = quiz.questions.create(title=quiz_data["title"])

        answers_to_create = [
            Answer(
                question=question, text=a_data["text"], is_correct=a_data["is_correct"]
            )
            for a_data in quiz_data.get("answers", [])
        ]
        Answer.objects.bulk_create(answers_to_create)


def _clear_post_content(post):
    """Busca en el mapa cómo borrar el contenido de este tipo de post y lo ejecuta."""
    clear_function = POST_CLEAR_MAP.get(post.post_type)
    if clear_function:
        clear_function(post)


POST_WRITERS_MAP = {
    "FLA": _write_flashcards,
    "QUI": _write_quiz,
}

POST_CLEAR_MAP = {
    "FLA": lambda post: post.fla.delete() if hasattr(post, "fla") else None,
    "QUI": lambda post: post.qui.delete() if hasattr(post, "qui") else None,
}


class DraftListView(views.APIView):
    def get(self, request):
        student = get_object_or_404(Student, pk=request.query_params.get("student"))
        drafts = Post.objects.filter(student=student, is_draft=True).order_by(
            "-updated_at"
        )
        return Response(DraftPostSerializer(drafts, many=True).data)

    @transaction.atomic
    def post(self, request):
        serializer = DraftCreateSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        data = serializer.validated_data
        post = Post.objects.create(
            student=data["student"],
            course=data["course"],
            post_type=data["post_type"],
            title=data["title"],
            description=data["description"],
            is_draft=True,
        )

        writer_function = POST_WRITERS_MAP.get(post.post_type)
        if writer_function:
            writer_function(post, data)
        return Response(DraftPostSerializer(post).data, status=status.HTTP_201_CREATED)


class DraftDetailView(views.APIView):
    def get(self, request, pk):
        post = get_object_or_404(Post, pk=pk, is_draft=True)
        return Response(DraftPostSerializer(post).data)

    @transaction.atomic
    def patch(self, request, pk):
        post = get_object_or_404(Post, pk=pk, is_draft=True)
        serializer = DraftUpdateSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        data = serializer.validated_data
        post.title = data["title"]
        post.description = data["description"]

        publishing = request.data.get("publish") is True
        if publishing:
            post.is_draft = False

        post.save()

        _clear_post_content(post)

        writer_function = POST_WRITERS_MAP.get(post.post_type)
        if writer_function:
            writer_function(post, data)

        post.refresh_from_db()
        if publishing:
            notify_subscribers_of_new_post(post)
        return Response(DraftPostSerializer(post).data)

    def delete(self, request, pk):
        post = get_object_or_404(Post, pk=pk, is_draft=True)
        post.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
