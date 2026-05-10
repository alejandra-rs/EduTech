from django.shortcuts import get_object_or_404
from rest_framework import views, status
from rest_framework.response import Response
from users.models import Student
from ..models import Folder
from ..serializers import (
    FolderDetailSerializer,
    FolderSerializer,
    FolderCreateSerializer,
    FolderRenameSerializer,
    FolderMoveSerializer,
)

MAX_SUBFOLDERS = 100


def _get_student(query_params):
    return get_object_or_404(Student, pk=query_params.get("student"))


class FolderRootView(views.APIView):
    def get(self, request):
        student = _get_student(request.query_params)
        qs = Folder.objects.filter(student=student, depth=1)
        if qs.exists():
            root = qs.first()
        else:
            root = Folder.add_root(name="root", student=student)
        root = (
            Folder.objects.prefetch_related("saved_posts__post")
            .filter(pk=root.pk)
            .first()
        )
        return Response(FolderDetailSerializer(root).data)


class FolderCreateView(views.APIView):
    def post(self, request):
        serializer = FolderCreateSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        data = serializer.validated_data
        student = get_object_or_404(Student, pk=data["student_id"])
        parent = get_object_or_404(Folder, pk=data["parent_id"], student=student)

        if Folder.objects.filter(student=student, depth__gt=1).count() >= MAX_SUBFOLDERS:
            return Response(
                {"detail": f"No puedes tener más de {MAX_SUBFOLDERS} subcarpetas."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        if parent.get_children().filter(name=data["name"]).exists():
            return Response(
                {"detail": "Ya existe una carpeta con ese nombre aquí."},
                status=status.HTTP_409_CONFLICT,
            )

        folder = parent.add_child(name=data["name"], student=student)
        return Response(FolderSerializer(folder).data, status=status.HTTP_201_CREATED)


class FolderDetailView(views.APIView):
    def _get_folder_for_student(self, pk, student):
        return get_object_or_404(Folder, pk=pk, student=student)

    def get(self, request, pk):
        student = _get_student(request.query_params)
        folder = self._get_folder_for_student(pk, student)
        folder = (
            Folder.objects.prefetch_related("saved_posts__post")
            .filter(pk=folder.pk)
            .first()
        )
        return Response(FolderDetailSerializer(folder).data)

    def patch(self, request, pk):
        student = _get_student(request.query_params)
        folder = self._get_folder_for_student(pk, student)

        if folder.depth == 1:
            return Response(
                {"detail": "No se puede renombrar la carpeta raíz."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        serializer = FolderRenameSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        new_name = serializer.validated_data["name"]

        if folder.get_siblings().filter(name=new_name).exclude(pk=folder.pk).exists():
            return Response(
                {"detail": "Ya existe una carpeta con ese nombre aquí."},
                status=status.HTTP_409_CONFLICT,
            )

        folder.name = new_name
        folder.save()
        return Response(FolderSerializer(folder).data)

    def delete(self, request, pk):
        student = _get_student(request.query_params)
        folder = self._get_folder_for_student(pk, student)

        if folder.depth == 1:
            return Response(
                {"detail": "No se puede eliminar la carpeta raíz."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        folder.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


class FolderMoveView(views.APIView):
    def patch(self, request, pk):
        student = _get_student(request.query_params)
        folder = get_object_or_404(Folder, pk=pk, student=student)

        if folder.depth == 1:
            return Response(
                {"detail": "No se puede mover la carpeta raíz."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        serializer = FolderMoveSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        target_id = serializer.validated_data["target_id"]
        target = get_object_or_404(Folder, pk=target_id, student=student)

        if target.pk == folder.pk:
            return Response(
                {"detail": "No puedes mover una carpeta a sí misma."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        if folder.is_ancestor_of(target):
            return Response(
                {"detail": "No puedes mover una carpeta a uno de sus descendientes."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        folder.move(target, pos="sorted-child")
        folder.refresh_from_db()
        return Response(FolderSerializer(folder).data)
