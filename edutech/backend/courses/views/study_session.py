from django.db.models import Q
from django.shortcuts import get_object_or_404
from django.utils import timezone
from rest_framework import views, status
from rest_framework.response import Response

from users.models import Student
from ..models import Course, StudySession, StudySessionComment
from ..serializers import StudySessionSerializer, StudySessionCommentSerializer


class StudySessionListCreateView(views.APIView):
    def get(self, request):
        qs = StudySession.objects.select_related("creator", "course").filter(
            scheduled_at__gte=timezone.now()
        )

        course_ids = request.query_params.getlist("courses")
        if course_ids:
            qs = qs.filter(course_id__in=course_ids)

        raw_student_id = request.query_params.get("student_id")
        try:
            student_id = int(raw_student_id)
        except (TypeError, ValueError):
            student_id = None

        if request.query_params.get("starred") == "true" and student_id:
            qs = qs.filter(
                Q(creator_id=student_id) | Q(participants__id=student_id)
            ).distinct()

        serializer = StudySessionSerializer(
            qs, many=True, context={"student_id": student_id}
        )
        return Response(serializer.data)

    def post(self, request):
        title = request.data.get("title", "").strip()
        description = request.data.get("description", "").strip()
        scheduled_at = request.data.get("scheduled_at")
        course_id = request.data.get("course")
        creator_id = request.data.get("creator")

        if not title:
            return Response(
                {"detail": "No se ha indicado un título para la sesión"},
                status=status.HTTP_400_BAD_REQUEST,
            )
        if not scheduled_at:
            return Response(
                {"detail": "No se ha indicado una fecha para la sesión"},
                status=status.HTTP_400_BAD_REQUEST,
            )
        if not creator_id:
            return Response(
                {"detail": "Faltan campos requeridos."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        course = get_object_or_404(Course, pk=course_id) if course_id else None
        creator = get_object_or_404(Student, pk=creator_id)

        session = StudySession.objects.create(
            title=title,
            description=description,
            scheduled_at=scheduled_at,
            course=course,
            creator=creator,
        )
        return Response(
            StudySessionSerializer(session).data, status=status.HTTP_201_CREATED
        )


class StudySessionDetailView(views.APIView):
    def delete(self, request, pk):
        session = get_object_or_404(StudySession, pk=pk)
        session.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


class StudySessionStarView(views.APIView):
    def post(self, request, pk):
        session = get_object_or_404(StudySession, pk=pk)
        student_id = request.data.get("student_id")
        if not student_id:
            return Response(
                {"detail": "Falta student_id."}, status=status.HTTP_400_BAD_REQUEST
            )
        student = get_object_or_404(Student, pk=student_id)
        session.participants.add(student)
        return Response(status=status.HTTP_200_OK)

    def delete(self, request, pk):
        session = get_object_or_404(StudySession, pk=pk)
        student_id = request.query_params.get("student_id")
        if not student_id:
            return Response(
                {"detail": "Falta student_id."}, status=status.HTTP_400_BAD_REQUEST
            )
        student = get_object_or_404(Student, pk=student_id)
        session.participants.remove(student)
        return Response(status=status.HTTP_204_NO_CONTENT)


class StudySessionCommentView(views.APIView):
    def get(self, request, pk):
        session = get_object_or_404(StudySession, pk=pk)
        comments = session.session_comments.select_related("student")
        return Response(StudySessionCommentSerializer(comments, many=True).data)

    def post(self, request, pk):
        session = get_object_or_404(StudySession, pk=pk)
        student_id = request.data.get("student_id")
        message = request.data.get("message", "").strip()
        if not student_id:
            return Response(
                {"detail": "Falta student_id."}, status=status.HTTP_400_BAD_REQUEST
            )
        if not message:
            return Response(
                {"detail": "El mensaje no puede estar vacío."},
                status=status.HTTP_400_BAD_REQUEST,
            )
        student = get_object_or_404(Student, pk=student_id)
        comment = StudySessionComment.objects.create(
            session=session, student=student, message=message
        )
        return Response(
            StudySessionCommentSerializer(comment).data, status=status.HTTP_201_CREATED
        )
