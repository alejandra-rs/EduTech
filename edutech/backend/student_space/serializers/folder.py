from rest_framework import serializers
from ..models import Folder
from .saved_post import SavedPostSerializer


class FolderBreadcrumbSerializer(serializers.ModelSerializer):
    class Meta:
        model = Folder
        fields = ["id", "name"]


class FolderSerializer(serializers.ModelSerializer):
    class Meta:
        model = Folder
        fields = ["id", "name", "depth", "created_at"]


class FolderDetailSerializer(serializers.ModelSerializer):
    breadcrumbs = serializers.SerializerMethodField()
    children = serializers.SerializerMethodField()
    saved_posts = SavedPostSerializer(many=True, read_only=True)

    def get_breadcrumbs(self, obj):
        return FolderBreadcrumbSerializer(obj.get_ancestors(), many=True).data

    def get_children(self, obj):
        return FolderSerializer(obj.get_children(), many=True).data

    class Meta:
        model = Folder
        fields = ["id", "name", "depth", "breadcrumbs", "children", "saved_posts", "created_at"]


class FolderCreateSerializer(serializers.Serializer):
    name = serializers.CharField(max_length=100, trim_whitespace=True)
    parent_id = serializers.IntegerField()
    student_id = serializers.IntegerField()


class FolderRenameSerializer(serializers.Serializer):
    name = serializers.CharField(max_length=100, trim_whitespace=True)


class FolderMoveSerializer(serializers.Serializer):
    target_id = serializers.IntegerField()
