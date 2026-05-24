from django.utils import timezone
from django.shortcuts import get_object_or_404
from rest_framework import status
from rest_framework.response import Response
from users.base_views import AuthStudentView
from documents.models import Post
from ..models import Folder, SavedPost
from ..serializers import (
    SavedPostSerializer,
    SavedPostCreateSerializer,
    SavedPostUpdateSerializer,
    SavedPostMoveSerializer,
)


class SavedPostView(AuthStudentView):
    def post(self, request):
        serializer = SavedPostCreateSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        data = serializer.validated_data
        student = self.get_student()
        folder = get_object_or_404(Folder, pk=data["folder_id"], student=student)
        post = get_object_or_404(Post, pk=data["post_id"])

        if post.is_draft:
            return Response(
                {"detail": "No se pueden guardar borradores."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        saved, created = SavedPost.objects.get_or_create(folder=folder, post=post)
        if not created:
            return Response(
                {"detail": "Esta publicación ya está guardada en esta carpeta."},
                status=status.HTTP_409_CONFLICT,
            )

        return Response(SavedPostSerializer(saved).data, status=status.HTTP_201_CREATED)

    def patch(self, request, pk):
        student = self.get_student()
        saved = get_object_or_404(SavedPost, pk=pk, folder__student=student)

        serializer = SavedPostUpdateSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        is_pinned = serializer.validated_data["is_pinned"]
        saved.is_pinned = is_pinned
        saved.pinned_at = timezone.now() if is_pinned else None
        saved.save()
        return Response(SavedPostSerializer(saved).data)

    def delete(self, request, pk):
        student = self.get_student()
        saved = get_object_or_404(SavedPost, pk=pk, folder__student=student)
        saved.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


class SavedPostMoveView(AuthStudentView):
    def patch(self, request, pk):
        student = self.get_student()
        saved = get_object_or_404(SavedPost, pk=pk, folder__student=student)

        serializer = SavedPostMoveSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        folder_id = serializer.validated_data["folder_id"]
        new_folder = get_object_or_404(Folder, pk=folder_id, student=student)

        if new_folder.pk == saved.folder.pk:
            return Response(
                {"detail": "La publicación ya está en esta carpeta."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        if SavedPost.objects.filter(folder=new_folder, post=saved.post).exists():
            return Response(
                {"detail": "Esta publicación ya está guardada en la carpeta de destino."},
                status=status.HTTP_409_CONFLICT,
            )

        saved.folder = new_folder
        saved.save()
        return Response(SavedPostSerializer(saved).data)


class CheckSavedPostView(AuthStudentView):
    def get(self, request, post_id):
        student = self.get_student()
        saved_post = SavedPost.objects.filter(
            post_id=post_id,
            folder__student=student,
        ).first()

        if saved_post:
            return Response({"is_saved": True, "saved_post_id": saved_post.id})

        return Response({"is_saved": False, "saved_post_id": None})


class SpaceStatsView(AuthStudentView):
    def get(self, request):
        student = self.get_student()
        return Response({
            "folder_count": Folder.objects.filter(student=student, depth__gt=1).count(),
            "saved_post_count": SavedPost.objects.filter(folder__student=student).count(),
        })


class BatchDeleteView(AuthStudentView):
    def delete(self, request):
        student = self.get_student()
        folder_ids = request.data.get("folder_ids", [])
        saved_post_ids = request.data.get("saved_post_ids", [])
        Folder.objects.filter(pk__in=folder_ids, student=student, depth__gt=1).delete()
        SavedPost.objects.filter(pk__in=saved_post_ids, folder__student=student).delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
