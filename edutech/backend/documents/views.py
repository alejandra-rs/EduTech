import boto3
from absl.flags import ValidationError
from django.http import HttpResponseRedirect
from django.shortcuts import render, get_object_or_404
from django.conf import settings
from rest_framework.response import Response
from rest_framework import status, generics, views
from courses.models import Course
from users.models import Student
from .models import Post, PDFAttachment, YoutubeVideo, Like, Dislike, Comment
from .serializers import PostSerializer, PDFUploadSerializer, VideoUploadSerializer, CommentListSerializer, \
    LikeSerializer, DislikeSerializer
from .filters import PostFilter


class PostListView(generics.ListAPIView):
    queryset = Post.objects.all()
    serializer_class = PostSerializer
    filterset_class = PostFilter

    def list(self, request, *args, **kwargs):
        course_id = request.query_params.get('course')
        if course_id is not None:
            get_object_or_404(Course, pk=course_id)  # 404 if course doesn't exist
        return super().list(request, *args, **kwargs)


class PDFUploadView(generics.GenericAPIView):
    serializer_class = PDFUploadSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        post = Post.objects.create(
            title=serializer.validated_data['title'],
            description=serializer.validated_data['description'],
            course=serializer.validated_data['course'],
            student=serializer.validated_data['student'],
            post_type='PDF',
        )

        PDFAttachment.objects.create(
            post=post,
            file=serializer.validated_data['file'],
        )

        return Response(PostSerializer(post).data, status=status.HTTP_201_CREATED)


class VideoUploadView(generics.GenericAPIView):
    serializer_class = VideoUploadSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        post = Post.objects.create(
            title=serializer.validated_data['title'],
            description=serializer.validated_data['description'],
            course=serializer.validated_data['course'],
            student=serializer.validated_data['student'],
            post_type='VID',
        )

        YoutubeVideo.objects.create(
            post=post,
            vid=serializer.validated_data['vid'],
        )

        return Response(PostSerializer(post, context={'request': request}).data, status=status.HTTP_201_CREATED)


class PDFDownloadView(views.APIView):
    def get(self, request, post_id):
        post = get_object_or_404(Post, pk=post_id, post_type='PDF')

        attachment = post.pdf
        key = attachment.file.name
        filename = key.split('/')[-1]

        s3 = boto3.client(
            's3',
            endpoint_url=settings.AWS_S3_ENDPOINT_URL,
            aws_access_key_id=settings.AWS_ACCESS_KEY_ID,
            aws_secret_access_key=settings.AWS_SECRET_ACCESS_KEY,
            region_name=settings.AWS_S3_REGION_NAME,
        )

        url = s3.generate_presigned_url(
            'get_object',
            Params={
                'Bucket': settings.AWS_STORAGE_BUCKET_NAME,
                'Key': key,
                'ResponseContentDisposition': f'attachment; filename="{filename}"',
                'ResponseContentType': 'application/pdf',
            },
            ExpiresIn=300,
        )

        return HttpResponseRedirect(url)


class CommentCreateView(views.APIView):
    def post(self, request, post_id):
        post = get_object_or_404(Post, pk=post_id)
        user = get_object_or_404(Student, pk=request.data.get('user'))
        message = request.data.get('message', '').strip()
        if not message:
            return Response({"detail": "El mensaje no puede estar vacío."}, status=status.HTTP_400_BAD_REQUEST)
        comment = Comment.objects.create(user=user, post=post, message=message)
        return Response(CommentListSerializer(comment).data, status=status.HTTP_201_CREATED)


class LikeView(views.APIView):
    serializer_class = LikeSerializer

    def get(self, request):
        user = request.query_params.get('user')
        post = request.query_params.get('post')

        like = Like.objects.filter(user=user, post=post).first()
        if like:
            return Response({"id": like.id}, status=status.HTTP_200_OK)
        return Response({}, status=status.HTTP_200_OK)

    def post(self, request):
        user = get_object_or_404(Student, pk=request.data.get('user'))
        post = get_object_or_404(Post, pk=request.data.get('post'))
        like_exists = Like.objects.filter(user=user, post=post).first()
        if like_exists:
            return Response({"detail": "Ya existe un like para este usuario en este post."}, status=status.HTTP_200_OK)
        like = Like(user=user, post=post)
        try:
            like.full_clean()
        except ValidationError as e:
            return Response({"detail": e.messages}, status=status.HTTP_400_BAD_REQUEST)
        like.save()
        return Response({"id": like.id}, status=status.HTTP_201_CREATED)

    def delete(self, request, pk):
        like = get_object_or_404(Like, pk=pk)
        count, _ = like.delete()
        if count == 0:
            return Response({"detail": "No se ha podido anular el like"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        return Response({"detail": "Like eliminado con éxito"}, status=status.HTTP_200_OK)


class DislikeView(views.APIView):
    serializer_class = DislikeSerializer

    def get(self, request, pk=None):
        user = request.query_params.get('user')
        post = request.query_params.get('post')

        dislike = Dislike.objects.filter(user=user, post=post).first()
        if dislike:
            return Response({"id": dislike.id}, status=status.HTTP_200_OK)
        return Response({}, status=status.HTTP_200_OK)

    def post(self, request):
        user = get_object_or_404(Student, pk=request.data.get('user'))
        post = get_object_or_404(Post, pk=request.data.get('post'))
        dislike_exists = Dislike.objects.filter(user=user, post=post).first()
        if dislike_exists:
            return Response({"detail": "Ya existe un dislike para este usuario en este post."}, status=status.HTTP_200_OK)
        dislike = Dislike(user=user, post=post)
        try:
            dislike.full_clean()
        except ValidationError as e:
            return Response({"detail": e.messages}, status=status.HTTP_400_BAD_REQUEST)
        dislike.save()
        return Response({"id": dislike.id}, status=status.HTTP_201_CREATED)

    def delete(self, request, pk):
        dislike = get_object_or_404(Dislike, pk=pk)
        count, _ = dislike.delete()
        if count == 0:
            return Response({"detail": "No se ha podido anular el dislike"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        return Response({"detail": "Dislike eliminado con éxito"}, status=status.HTTP_200_OK)