from rest_framework import serializers
from .models import Post, PDFAttachment, YoutubeVideo
from courses.models import Course
from users.models import Student


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
        fields = ['id', 'url']


class PostSerializer(serializers.ModelSerializer):
    pdf = PDFAttachmentSerializer(read_only=True)
    video = YoutubeVideoSerializer(read_only=True)

    class Meta:
        model = Post
        fields = ['id', 'title', 'description', 'post_type',
                  'course', 'student', 'created_at',
                  'pdf', 'video']


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
    url = serializers.URLField()

    def validate(self, data):
        validity_test = YoutubeVideo(file=data['url'])
        validity_test.full_clean(exclude=['post'])
        return data
