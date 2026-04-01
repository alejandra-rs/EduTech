import boto3
from django.http import HttpResponseRedirect
from django.shortcuts import render, get_object_or_404
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status, generics, views
from .models import Post, PDFAttachment, YoutubeVideo
from .serializers import PostSerializer, PDFUploadSerializer, VideoUploadSerializer
from edutech import settings


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