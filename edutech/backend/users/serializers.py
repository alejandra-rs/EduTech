from rest_framework import serializers
from .models import Post, PDFAttachment, YoutubeVideo
from courses.models import Course
from users.models import Student


class PDFAttachmentSerializer(serializers.ModelSerializer):
    download_url = serializers.SerializerMethodField()

    class Meta:
        model = PDFAttachment
        fields = ['id', 'file']

    def get_download_url(self, instance):
        return instance.file.url if instance.file else None

