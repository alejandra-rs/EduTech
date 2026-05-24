from django.shortcuts import get_object_or_404
from rest_framework import generics, views, status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from users.models import Student
from ..models import Post, Quiz, Question
from ..serializers import QuizUploadSerializer, QuizCheckSerializer, PostSerializer


class QuizUploadView(generics.GenericAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = QuizUploadSerializer

    def post(self, request):
        serializer = self.get_serializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        data = serializer.validated_data
        student = get_object_or_404(Student, email=request.user.email)
        post = Post.objects.create(
            title=data["title"],
            description=data["description"],
            course=data["course"],
            student=student,
            post_type="QUI",
        )
        quiz = Quiz.objects.create(post=post)
        for q_data in data["questions"]:
            question = Question.objects.create(quiz=quiz, title=q_data["title"])
            for a_data in q_data["answers"]:
                question.answers.create(
                    text=a_data["text"], is_correct=a_data["is_correct"]
                )

        return Response(PostSerializer(post).data, status=status.HTTP_201_CREATED)


class QuizCheckView(views.APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, post_pk):
        post = get_object_or_404(Post, pk=post_pk, post_type="QUI")
        quiz = post.qui

        serializer = QuizCheckSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        results = []
        for response in serializer.validated_data["responses"]:
            question = response["question"]
            if question.quiz_id != quiz.id:
                return Response(
                    {
                        "detail": f"La pregunta {question.id} no pertenece a este cuestionario."
                    },
                    status=status.HTTP_400_BAD_REQUEST,
                )
            selected_ids = {a.id for a in response["selected"]}
            correct_ids = set(
                question.answers.filter(is_correct=True).values_list("id", flat=True)
            )
            results.append(
                {
                    "question": question.id,
                    "correct": selected_ids == correct_ids,
                    "correct_answers": list(correct_ids),
                }
            )

        score = sum(1 for r in results if r["correct"])
        return Response({"results": results, "score": score, "total": len(results)})
