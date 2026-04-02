from rest_framework import serializers
from .models import Post, PDFAttachment, YoutubeVideo
from courses.models import Course
from users.models import Student
import urllib.request
import urllib.parse

class PDFAttachmentSerializer(serializers.ModelSerializer):
    download_url = serializers.SerializerMethodField()

    class Meta:
        model = PDFAttachment
        fields = ['id', 'file', 'download_url']

    def get_download_url(self, instance):
        return instance.file.url if instance.file else None


class YoutubeVideoSerializer(serializers.ModelSerializer):
    class Meta:
        model = YoutubeVideo
        fields = ['id', 'vid']


class PostSerializer(serializers.ModelSerializer):
    pdf = PDFAttachmentSerializer(read_only=True)
    vid = YoutubeVideoSerializer(read_only=True)

    class Meta:
        model = Post
        fields = ['id', 'title', 'description', 'post_type',
                  'course', 'student', 'created_at',
                  'pdf', 'vid']


class PDFUploadSerializer(serializers.Serializer):
    title = serializers.CharField(max_length=200)
    description = serializers.CharField()
    course = serializers.PrimaryKeyRelatedField(queryset=Course.objects.all())
    student = serializers.PrimaryKeyRelatedField(queryset=Student.objects.all(), required=False, allow_null=True)
    file = serializers.FileField()

    def validate(self, data):
        validity_test = PDFAttachment(file=data['file'])
        validity_test.full_clean(exclude=['post'])
        return data


class VideoUploadSerializer(serializers.Serializer):
    title = serializers.CharField(max_length=200)
    description = serializers.CharField()
    course = serializers.PrimaryKeyRelatedField(queryset=Course.objects.all())
    student = serializers.PrimaryKeyRelatedField(queryset=Student.objects.all(), required=False, allow_null=True)
    vid = serializers.URLField()

    def validate_vid(self, video):
       oembed_url = 'https://www.youtube.com/oembed?format=json&url=' + urllib.parse.quote(video)
       try:
           with urllib.request.urlopen(oembed_url):
               return video
       except Exception:
           raise serializers.ValidationError('El vídeo de YouTube no existe o no es válido.')