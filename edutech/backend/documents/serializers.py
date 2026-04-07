from rest_framework import serializers
from .models import Post, PDFAttachment, YoutubeVideo, Comment, Like, Dislike
from courses.models import Course
from users.models import Student
from users.serializers import StudentSerializer
import urllib.request
import urllib.parse


class PDFAttachmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = PDFAttachment
        fields = ['id', 'file']


class YoutubeVideoSerializer(serializers.ModelSerializer):
    class Meta:
        model = YoutubeVideo
        fields = ['id', 'vid']


class CommentListSerializer(serializers.ModelSerializer):
    user = StudentSerializer(read_only=True)

    class Meta:
        model = Comment
        fields = ['id', 'message', 'user', 'created_at']


class PostPreviewSerializer(serializers.ModelSerializer):
    pdf = PDFAttachmentSerializer(read_only=True)
    vid = YoutubeVideoSerializer(read_only=True)
    likes = serializers.SerializerMethodField()
    dislikes = serializers.SerializerMethodField()
    year = serializers.IntegerField(source='course.year.id', read_only=True)

    def get_likes(self, obj):
        return obj.like_set.count()

    def get_dislikes(self, obj):
        return obj.dislike_set.count()

    class Meta:
        model = Post
        fields = ['id', 'title', 'post_type', 'created_at',
                  'course', 'year',
                  'pdf', 'vid', 'views', 'likes', 'dislikes']


class PostSerializer(serializers.ModelSerializer):
    pdf = PDFAttachmentSerializer(read_only=True)
    vid = YoutubeVideoSerializer(read_only=True)
    student = StudentSerializer(read_only=True)

    class Meta:
        model = Post
        fields = ['id', 'title', 'description', 'post_type',
                  'course', 'student', 'created_at',
                  'pdf', 'vid', 'views']


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
    file = serializers.URLField()

    def validate_file(self, video):
       oembed_url = 'https://www.youtube.com/oembed?format=json&url=' + urllib.parse.quote(video)
       try:
           with urllib.request.urlopen(oembed_url):
               return video
       except Exception:
           raise serializers.ValidationError('El vídeo de YouTube no existe o no es válido.')


class LikeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Like
        fields = ['user', 'post']


class DislikeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Dislike
        fields = ['user', 'post']