import urllib.request
import urllib.parse
from rest_framework import serializers
from courses.models import Course
from users.models import Student
from ..models import PDFAttachment, YoutubeVideo


class PDFAttachmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = PDFAttachment
        fields = ["id", "file"]


class YoutubeVideoSerializer(serializers.ModelSerializer):
    class Meta:
        model = YoutubeVideo
        fields = ["id", "vid"]


class PDFUploadSerializer(serializers.Serializer):
    title = serializers.CharField(max_length=200)
    description = serializers.CharField()
    course = serializers.PrimaryKeyRelatedField(queryset=Course.objects.all())
    student = serializers.PrimaryKeyRelatedField(
        queryset=Student.objects.all(), required=False, allow_null=True
    )
    file = serializers.FileField()

    def validate(self, data):
        validity_test = PDFAttachment(file=data["file"])
        validity_test.full_clean(exclude=["post"])
        return data


class VideoUploadSerializer(serializers.Serializer):
    title = serializers.CharField(max_length=200)
    description = serializers.CharField()
    course = serializers.PrimaryKeyRelatedField(queryset=Course.objects.all())
    student = serializers.PrimaryKeyRelatedField(
        queryset=Student.objects.all(), required=False, allow_null=True
    )
    url = serializers.URLField()

    def validate_url(self, video):
        oembed_url = (
            "https://www.youtube.com/oembed?format=json&url="
            + urllib.parse.quote(video)
        )
        try:
            with urllib.request.urlopen(oembed_url):
                return video
        except Exception:
            raise serializers.ValidationError(
                "El vídeo de YouTube no existe o no es válido."
            )
