from rest_framework.response import Response
from users.base_views import AuthStudentView
from ..models import SavedPost
from ..serializers import SavedPostSerializer


class PinnedPostView(AuthStudentView):
    def get(self, request):
        student = self.get_student()
        pins = (
            SavedPost.objects.filter(folder__student=student, is_pinned=True)
            .select_related("post")
            .order_by("-pinned_at")
        )
        return Response(SavedPostSerializer(pins, many=True).data)
