from django.shortcuts import render
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status, generics
from .models import Post, PDFAttachment, YoutubeVideo
from .serializers import PostSerializer, PDFUploadSerializer, VideoUploadSerializer


class PostListView(generics.ListAPIView):
    queryset = Post.objects.all()
    serializer_class = PostSerializer


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
        serializer = VideoUploadSerializer(data=request.data)
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

        return Response(VideoUploadSerializer(post).data, status=status.HTTP_201_CREATED)