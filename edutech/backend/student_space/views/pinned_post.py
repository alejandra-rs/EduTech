from django.shortcuts import get_object_or_404
from rest_framework import views
from rest_framework.response import Response
from users.models import Student
from ..models import SavedPost
from ..serializers import SavedPostSerializer


class PinnedPostView(views.APIView):
    def get(self, request):
        student = get_object_or_404(Student, pk=request.query_params.get("student"))
        pins = (
            SavedPost.objects.filter(folder__student=student, is_pinned=True)
            .select_related("post")
            .order_by("-pinned_at")
        )
        return Response(SavedPostSerializer(pins, many=True).data)
