import boto3
from django.core.exceptions import ValidationError
from django.http import HttpResponseRedirect
from django.shortcuts import get_object_or_404
from django.conf import settings
from django.db.models import F
from rest_framework.response import Response
from rest_framework import status, generics, views
from courses.models import Course
from users.models import Student
from .models import Post, PDFAttachment, YoutubeVideo, Like, Dislike, Comment
from .serializers import (
    PostSerializer,
    PDFUploadSerializer,
    VideoUploadSerializer,
    CommentListSerializer,
    LikeSerializer,
    DislikeSerializer,
    PostPreviewSerializer,
)
from .filters import PostFilter
from ai_agent.vectorizator import ingerir_nuevo_documento

class PostListView(generics.ListAPIView):
    queryset = Post.objects.all()
    serializer_class = PostPreviewSerializer
    filterset_class = PostFilter

    def list(self, request, *args, **kwargs):
        course_id = request.query_params.get("course")
        if course_id is not None:
            get_object_or_404(Course, pk=course_id)
        return super().list(request, *args, **kwargs)


class PostDetailView(views.APIView):
    def get(self, request, pk):
        post = get_object_or_404(Post, pk=pk)
        Post.objects.filter(pk=pk).update(views=F("views") + 1)
        post.refresh_from_db()
        return Response(PostSerializer(post).data)


class PDFUploadView(generics.GenericAPIView):
    serializer_class = PDFUploadSerializer

    def post(self, request):
        serializer = self.get_serializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        post = Post.objects.create(
            title=serializer.validated_data["title"],
            description=serializer.validated_data["description"],
            course=serializer.validated_data["course"],
            student=serializer.validated_data["student"],
            post_type="PDF",
        )

        pdf_attachment = PDFAttachment.objects.create(
            post=post,
            file=serializer.validated_data["file"],
        )
        ingerir_nuevo_documento(pdf_attachment)

        return Response(PostSerializer(post).data, status=status.HTTP_201_CREATED)


class VideoUploadView(generics.GenericAPIView):
    serializer_class = VideoUploadSerializer

    def post(self, request):
        serializer = self.get_serializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        post = Post.objects.create(
            title=serializer.validated_data["title"],
            description=serializer.validated_data["description"],
            course=serializer.validated_data["course"],
            student=serializer.validated_data["student"],
            post_type="VID",
        )

        YoutubeVideo.objects.create(
            post=post,
            vid=serializer.validated_data["file"],
        )

        return Response(
            PostSerializer(post, context={"request": request}).data,
            status=status.HTTP_201_CREATED,
        )


class PDFDownloadView(views.APIView):
    def get(self, request, post_id):
        post = get_object_or_404(Post, pk=post_id, post_type="PDF")

        attachment = post.pdf
        key = attachment.file.name
        filename = key.split("/")[-1]

        s3 = boto3.client(
            "s3",
            endpoint_url=settings.AWS_S3_ENDPOINT_URL,
            aws_access_key_id=settings.AWS_ACCESS_KEY_ID,
            aws_secret_access_key=settings.AWS_SECRET_ACCESS_KEY,
            region_name=settings.AWS_S3_REGION_NAME,
        )

        url = s3.generate_presigned_url(
            "get_object",
            Params={
                "Bucket": settings.AWS_STORAGE_BUCKET_NAME,
                "Key": key,
                "ResponseContentDisposition": f'attachment; filename="{filename}"',
                "ResponseContentType": "application/pdf",
            },
            ExpiresIn=300,
        )

        return HttpResponseRedirect(url)


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
        return Response(
            CommentListSerializer(comment).data, status=status.HTTP_201_CREATED
        )


class LikeView(views.APIView):
    serializer_class = LikeSerializer

    def get(self, request):
        user = request.query_params.get("user")
        post = request.query_params.get("post")
        like = Like.objects.filter(user=user, post=post).first()
        count = Like.objects.filter(post=post).count()

        return Response(
            {"id": like.id if like else -1, "count": count}, status=status.HTTP_200_OK
        )

    def post(self, request):
        user = get_object_or_404(Student, pk=request.data.get("user"))
        post = get_object_or_404(Post, pk=request.data.get("post"))
        like = Like.objects.filter(user=user, post=post).first()
        count = Like.objects.filter(post=post).count()

        if like:
            return Response({"id": like.id, "count": count}, status=status.HTTP_200_OK)

        new_like = Like(user=user, post=post)
        try:
            new_like.full_clean()
        except ValidationError as e:
            return Response({"detail": e.messages}, status=status.HTTP_400_BAD_REQUEST)
        new_like.save()
        return Response(
            {"id": new_like.id, "count": count + 1}, status=status.HTTP_201_CREATED
        )

    def delete(self, request, pk):
        like = get_object_or_404(Like, pk=pk)
        count, _ = like.delete()
        if count == 0:
            return Response(
                {"detail": "No se ha podido anular el like"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )
        return Response(
            {"detail": "Like eliminado con éxito"}, status=status.HTTP_200_OK
        )


class DislikeView(views.APIView):
    serializer_class = DislikeSerializer

    def get(self, request):
        user = request.query_params.get("user")
        post = request.query_params.get("post")
        dislike = Dislike.objects.filter(user=user, post=post).first()
        count = Dislike.objects.filter(post=post).count()

        return Response(
            {"id": dislike.id if dislike else -1, "count": count},
            status=status.HTTP_200_OK,
        )

    def post(self, request):
        user = get_object_or_404(Student, pk=request.data.get("user"))
        post = get_object_or_404(Post, pk=request.data.get("post"))
        dislike = Dislike.objects.filter(user=user, post=post).first()
        count = Dislike.objects.filter(post=post).count()

        if dislike:
            return Response(
                {"id": dislike.id, "count": count}, status=status.HTTP_200_OK
            )

        new_dislike = Dislike(user=user, post=post)
        try:
            new_dislike.full_clean()
        except ValidationError as e:
            return Response({"detail": e.messages}, status=status.HTTP_400_BAD_REQUEST)
        new_dislike.save()
        return Response(
            {"id": new_dislike.id, "count": count + 1}, status=status.HTTP_201_CREATED
        )

    def delete(self, request, pk):
        dislike = get_object_or_404(Dislike, pk=pk)
        count, _ = dislike.delete()
        if count == 0:
            return Response(
                {"detail": "No se ha podido anular el dislike"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )
        return Response(
            {"detail": "Dislike eliminado con éxito"}, status=status.HTTP_200_OK
        )
