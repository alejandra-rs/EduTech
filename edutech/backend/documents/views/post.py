from django.db.models import F
from django.shortcuts import get_object_or_404
from rest_framework import generics, views, status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from courses.models import Course
from users.models import Student
from ..models import Post
from ..serializers import PostPreviewSerializer, PostSerializer
from ..filters import PostFilter


class PostListView(generics.ListAPIView):
    permission_classes = [IsAuthenticated]
    queryset = Post.objects.filter(is_draft=False)
    serializer_class = PostPreviewSerializer
    filterset_class = PostFilter

    def list(self, request, *args, **kwargs):
        course_id = request.query_params.get("course")
        if course_id is not None:
            get_object_or_404(Course, pk=course_id)
        return super().list(request, *args, **kwargs)


class MyPostListView(generics.ListAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = PostPreviewSerializer
    filterset_class = PostFilter

    def get_queryset(self):
        student = get_object_or_404(Student, email=self.request.user.email)
        return Post.objects.filter(is_draft=False, student=student)


class PostDetailView(views.APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, pk):
        post = get_object_or_404(Post, pk=pk)
        Post.objects.filter(pk=pk).update(views=F("views") + 1)
        post.refresh_from_db()
        return Response(PostSerializer(post).data)


class PostDeleteView(views.APIView):
    permission_classes = [IsAuthenticated]

    def delete(self, request, pk):
        student = get_object_or_404(Student, email=request.user.email)
        post = get_object_or_404(Post, pk=pk, student=student)
        post.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
