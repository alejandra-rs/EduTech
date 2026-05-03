from django.shortcuts import get_object_or_404
from rest_framework import views, status
from rest_framework.response import Response

from users.models import Student
from ..models import Report, ReportReason, CommentReport
from ..models.interactions import Comment
from ..serializers import (
    ReportSerializer,
    ReportReasonSerializer,
    ReportResolutionSerializer,
    CommentReportSerializer,
)
from ..models.post import Post
from ..notifications import notify_author_of_removal


def _get_admin(request):
    admin_id = request.query_params.get("admin_id") or request.data.get("admin_id")
    if not admin_id:
        return None
    return Student.objects.filter(pk=admin_id, is_admin=True).first()


class ReportReasonListView(views.APIView):
    def get(self, request):
        reasons = ReportReason.objects.all()
        return Response(ReportReasonSerializer(reasons, many=True).data)


class ReportListView(views.APIView):
    def get(self, request):
        if not _get_admin(request):
            return Response(
                {"detail": "No autorizado."}, status=status.HTTP_403_FORBIDDEN
            )
        post_id = request.query_params.get("post")
        reports = Report.objects.select_related(
            "reason", "user", "post__course", "resolution"
        )
        if post_id:
            reports = reports.filter(post_id=post_id)
        return Response(ReportSerializer(reports, many=True).data)

    def post(self, request):
        reason_id = request.data.get("reason_id")
        description = request.data.get("description", "").strip()
        user_id = request.data.get("user_id")
        post_id = request.data.get("post_id")

        if not all([reason_id, description, user_id, post_id]):
            return Response(
                {"detail": "Faltan campos requeridos."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        reason = get_object_or_404(ReportReason, pk=reason_id)
        user = get_object_or_404(Student, pk=user_id)
        post = get_object_or_404(Post, pk=post_id)

        if Report.objects.filter(user=user, post=post).exists():
            return Response(
                {"detail": "Ya has reportado este contenido."},
                status=status.HTTP_409_CONFLICT,
            )

        report = Report.objects.create(
            reason=reason, description=description, user=user, post=post
        )
        return Response(ReportSerializer(report).data, status=status.HTTP_201_CREATED)


class ReportDeleteView(views.APIView):
    def delete(self, request, pk=None, post_pk=None):
        if not _get_admin(request):
            return Response(
                {"detail": "No autorizado."}, status=status.HTTP_403_FORBIDDEN
            )

        if post_pk is not None:
            get_object_or_404(Post, pk=post_pk)
            deleted_count, _ = Report.objects.filter(post_id=post_pk).delete()
            return Response(
                {"detail": f"{deleted_count} reporte(s) descartado(s)."},
                status=status.HTTP_200_OK,
            )

        report = get_object_or_404(Report, pk=pk)
        report.delete()
        return Response(
            {"detail": "Reporte eliminado con éxito."}, status=status.HTTP_200_OK
        )


class ReportResolveView(views.APIView):
    """Admin confirms a report: sends email to author, deletes all reports + the post."""

    def post(self, request, post_pk):
        if not _get_admin(request):
            return Response(
                {"detail": "No autorizado."}, status=status.HTTP_403_FORBIDDEN
            )

        post = get_object_or_404(Post, pk=post_pk)
        message = request.data.get("message", "").strip()
        if not message:
            return Response(
                {"detail": "El mensaje es requerido."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        author = post.student
        post_title = post.title

        notify_author_of_removal(
            author, post_title, message, request.FILES.get("image")
        )

        post.delete()
        return Response(
            {"detail": "Publicación eliminada y autor notificado."},
            status=status.HTTP_200_OK,
        )


class ReportCheckView(views.APIView):
    def get(self, request):
        user_id = request.query_params.get("user_id")
        post_id = request.query_params.get("post_id")
        if not user_id or not post_id:
            return Response(
                {"detail": "Faltan parámetros."}, status=status.HTTP_400_BAD_REQUEST
            )
        reported = Report.objects.filter(user_id=user_id, post_id=post_id).exists()
        return Response({"reported": reported})


class CommentReportCreateView(views.APIView):
    def post(self, request):
        reason_id = request.data.get("reason_id")
        description = request.data.get("description", "").strip()
        user_id = request.data.get("user_id")
        comment_id = request.data.get("comment_id")

        if not all([reason_id, description, user_id, comment_id]):
            return Response(
                {"detail": "Faltan campos requeridos."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        reason = get_object_or_404(ReportReason, pk=reason_id)
        user = get_object_or_404(Student, pk=user_id)
        comment = get_object_or_404(Comment, pk=comment_id)

        report = CommentReport.objects.create(
            reason=reason, description=description, user=user, comment=comment
        )
        return Response(
            CommentReportSerializer(report).data, status=status.HTTP_201_CREATED
        )


class ReportResolutionView(views.APIView):
    def get(self, request, report_pk):
        report = get_object_or_404(Report, pk=report_pk)
        resolution = getattr(report, "resolution", None)
        if resolution is None:
            return Response(
                {"detail": "Este reporte no tiene resolución."},
                status=status.HTTP_404_NOT_FOUND,
            )
        return Response(ReportResolutionSerializer(resolution).data)

    def post(self, request, report_pk):
        report = get_object_or_404(Report, pk=report_pk)
        if hasattr(report, "resolution"):
            return Response(
                {"detail": "Este reporte ya tiene una resolución."},
                status=status.HTTP_400_BAD_REQUEST,
            )
        serializer = ReportResolutionSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        serializer.save(report=report)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
