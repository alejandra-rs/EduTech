from django.core.exceptions import ValidationError
from django.shortcuts import get_object_or_404
from rest_framework import views, status
from rest_framework.response import Response
from users.models import Student
from ..models import Post, Like, Dislike, Comment
from ..serializers import CommentListSerializer, LikeSerializer, DislikeSerializer


class CommentView(views.APIView):
    serializer_class = CommentListSerializer

    def get(self, request):
        post = get_object_or_404(Post, pk=request.query_params.get("post"))
        comments = Comment.objects.filter(post=post)
        return Response(CommentListSerializer(comments, many=True).data)

    def post(self, request):
        post = get_object_or_404(Post, pk=request.query_params.get("post"))
        user = get_object_or_404(Student, pk=request.query_params.get("user"))
        message = request.data.get("message", "").strip()
        if not message:
            return Response(
                {"detail": "El mensaje no puede estar vacío."},
                status=status.HTTP_400_BAD_REQUEST,
            )
        comment = Comment.objects.create(user=user, post=post, message=message)
        return Response(CommentListSerializer(comment).data, status=status.HTTP_201_CREATED)


class LikeView(views.APIView):
    serializer_class = LikeSerializer

    def get(self, request):
        user = request.query_params.get("user")
        post = request.query_params.get("post")
        like = Like.objects.filter(user=user, post=post).first()
        count = Like.objects.filter(post=post).count()
        return Response({"id": like.id if like else -1, "count": count})

    def post(self, request):
        user = get_object_or_404(Student, pk=request.data.get("user"))
        post = get_object_or_404(Post, pk=request.data.get("post"))
        like = Like.objects.filter(user=user, post=post).first()
        count = Like.objects.filter(post=post).count()
        if like:
            return Response({"id": like.id, "count": count})
        new_like = Like(user=user, post=post)
        try:
            new_like.full_clean()
        except ValidationError as e:
            return Response({"detail": e.messages}, status=status.HTTP_400_BAD_REQUEST)
        new_like.save()
        return Response({"id": new_like.id, "count": count + 1}, status=status.HTTP_201_CREATED)

    def delete(self, request, pk):
        like = get_object_or_404(Like, pk=pk)
        count, _ = like.delete()
        if count == 0:
            return Response(
                {"detail": "No se ha podido anular el like"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )
        return Response({"detail": "Like eliminado con éxito"})


class DislikeView(views.APIView):
    serializer_class = DislikeSerializer

    def get(self, request):
        user = request.query_params.get("user")
        post = request.query_params.get("post")
        dislike = Dislike.objects.filter(user=user, post=post).first()
        count = Dislike.objects.filter(post=post).count()
        return Response({"id": dislike.id if dislike else -1, "count": count})

    def post(self, request):
        user = get_object_or_404(Student, pk=request.data.get("user"))
        post = get_object_or_404(Post, pk=request.data.get("post"))
        dislike = Dislike.objects.filter(user=user, post=post).first()
        count = Dislike.objects.filter(post=post).count()
        if dislike:
            return Response({"id": dislike.id, "count": count})
        new_dislike = Dislike(user=user, post=post)
        try:
            new_dislike.full_clean()
        except ValidationError as e:
            return Response({"detail": e.messages}, status=status.HTTP_400_BAD_REQUEST)
        new_dislike.save()
        return Response({"id": new_dislike.id, "count": count + 1}, status=status.HTTP_201_CREATED)

    def delete(self, request, pk):
        dislike = get_object_or_404(Dislike, pk=pk)
        count, _ = dislike.delete()
        if count == 0:
            return Response(
                {"detail": "No se ha podido anular el dislike"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )
        return Response({"detail": "Dislike eliminado con éxito"})
