from django.shortcuts import get_object_or_404
from rest_framework import views, status
from rest_framework.response import Response
from users.models import Student
from ..models import Post, FlashCardDeck, Quiz
from ..serializers import (
    DraftPostSerializer,
    DraftCreateSerializer,
    DraftUpdateSerializer,
)
from ..notifications import notify_subscribers_of_new_post


def _write_post_content(post, data):
    if post.post_type == "FLA":
        deck = FlashCardDeck.objects.create(post=post)
        for card in data.get("cards", []):
            deck.cards.create(question=card["question"], answer=card["answer"])
    elif post.post_type == "QUI":
        quiz = Quiz.objects.create(post=post)
        for q_data in data.get("questions", []):
            question = quiz.questions.create(title=q_data["title"])
            for a_data in q_data.get("answers", []):
                question.answers.create(
                    text=a_data["text"], is_correct=a_data["is_correct"]
                )


class DraftListView(views.APIView):
    def get(self, request):
        student = get_object_or_404(Student, pk=request.query_params.get("student"))
        drafts = Post.objects.filter(student=student, is_draft=True).order_by(
            "-updated_at"
        )
        return Response(DraftPostSerializer(drafts, many=True).data)

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
        _write_post_content(post, data)
        return Response(DraftPostSerializer(post).data, status=status.HTTP_201_CREATED)


class DraftDetailView(views.APIView):
    def get(self, request, pk):
        post = get_object_or_404(Post, pk=pk, is_draft=True)
        return Response(DraftPostSerializer(post).data)

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

        if hasattr(post, "fla"):
            post.fla.delete()
        if hasattr(post, "qui"):
            post.qui.delete()

        _write_post_content(post, data)
        post.refresh_from_db()
        if publishing:
            notify_subscribers_of_new_post(post)
        return Response(DraftPostSerializer(post).data)

    def delete(self, request, pk):
        post = get_object_or_404(Post, pk=pk, is_draft=True)
        post.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
