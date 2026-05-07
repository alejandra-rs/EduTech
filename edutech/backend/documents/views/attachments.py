import boto3
from django.conf import settings
from django.http import HttpResponseRedirect
from django.shortcuts import get_object_or_404
from rest_framework import generics, views, status
from rest_framework.response import Response
from ..models import Post, PDFAttachment, YoutubeVideo
from ..serializers import PDFUploadSerializer, VideoUploadSerializer, PostSerializer
from ai_agent.tasks import procesar_pdf_y_vectorizar


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
        PDFAttachment.objects.create(post=post, file=serializer.validated_data["file"])
        return Response(PostSerializer(post).data, status=status.HTTP_201_CREATED)


class UploadPDFDraftView(generics.GenericAPIView):
    serializer_class = PDFUploadSerializer

    def post(self, request):
        serializer = self.get_serializer(data=request.data)

        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        data = serializer.validated_data

        post = Post.objects.create(
            title=data["title"],
            description=data["description"],
            course=data["course"],
            student=data.get("student"),
            post_type="PDF",
            is_draft=True,
        )

        pdf_attachment = PDFAttachment.objects.create(
            post=post, file=data["file"], processing_status="pending"
        )

        procesar_pdf_y_vectorizar.delay(pdf_attachment.id)

        return Response(
            {
                "post_id": post.id,
                "attachment_id": pdf_attachment.id,
            },
            status=status.HTTP_201_CREATED,
        )


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
        YoutubeVideo.objects.create(post=post, vid=serializer.validated_data["file"])
        return Response(
            PostSerializer(post, context={"request": request}).data,
            status=status.HTTP_201_CREATED,
        )


class PDFDownloadView(views.APIView):
    def get(self, request, post_id):
        post = get_object_or_404(Post, pk=post_id, post_type="PDF")
        key = post.pdf.file.name
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
