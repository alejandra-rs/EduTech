from django.shortcuts import get_object_or_404
from rest_framework import views, status
from rest_framework.response import Response

from users.models import Student
from ..models import PDFRevisionNote
from ..models.attachments import PDFAttachment
from ..serializers.revision import RevisionNoteSerializer
from ..notifications import notify_author_of_publication, notify_author_of_discard, notify_subscribers_of_new_post


def _get_admin(request):
    admin_id = request.query_params.get("admin_id") or request.data.get("admin_id")
    if not admin_id:
        return None
    return Student.objects.filter(pk=admin_id, is_admin=True).first()


class RevisionListView(views.APIView):
    def get(self, request):
        if not _get_admin(request):
            return Response({"detail": "No autorizado."}, status=status.HTTP_403_FORBIDDEN)
        notes = PDFRevisionNote.objects.select_related(
            "attachment__post__student", "attachment__post__course"
        )
        return Response(RevisionNoteSerializer(notes, many=True).data)


class RevisionPublishView(views.APIView):
    def post(self, request, pk):
        if not _get_admin(request):
            return Response({"detail": "No autorizado."}, status=status.HTTP_403_FORBIDDEN)
        note = get_object_or_404(PDFRevisionNote, pk=pk)
        attachment = note.attachment
        post = attachment.post
        note.delete()
        attachment.processing_status = PDFAttachment.ProcessingStages.COMPLETED
        attachment.save()
        post.is_draft = False
        post.save()
        notify_author_of_publication(post.student, post.title)
        notify_subscribers_of_new_post(post)
        return Response({"detail": "Publicación aprobada y publicada."}, status=status.HTTP_200_OK)


class RevisionDeleteView(views.APIView):
    def delete(self, request, pk):
        if not _get_admin(request):
            return Response({"detail": "No autorizado."}, status=status.HTTP_403_FORBIDDEN)
        note = get_object_or_404(PDFRevisionNote, pk=pk)
        post = note.attachment.post
        author = post.student
        post_title = post.title
        note.delete()
        post.delete()
        notify_author_of_discard(author, post_title)
        return Response({"detail": "Borrador eliminado y autor notificado."}, status=status.HTTP_200_OK)
