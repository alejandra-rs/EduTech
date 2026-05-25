from rest_framework import views
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from django.shortcuts import get_object_or_404
from ..serializers import SubscriptionSerializer
from ..models import Course, Subscription
from users.models import Student


class SubscriptionView(views.APIView):
    permission_classes = [IsAuthenticated]
    serializer_class = SubscriptionSerializer

    def get(self, request):
        student = get_object_or_404(Student, email=request.user.email)
        course_id = request.query_params.get("course")

        if course_id:
            subscription = Subscription.objects.filter(
                user=student, course=course_id
            ).first()
            return Response(
                {"id": subscription.id} if subscription else {},
                status=status.HTTP_200_OK,
            )

        subscriptions = Subscription.objects.filter(user=student).select_related(
            "course__year"
        )
        serializer = self.serializer_class(subscriptions, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request):
        user = get_object_or_404(Student, email=request.user.email)
        course = get_object_or_404(Course, pk=request.data.get("course"))
        subscription, created = Subscription.objects.get_or_create(
            user=user, course=course
        )
        if not created:
            return Response(
                {"detail": "Ya estás suscrito a este curso."}, status=status.HTTP_200_OK
            )
        return Response({"id": subscription.id}, status=status.HTTP_201_CREATED)

    def delete(self, request, pk):
        subscription = get_object_or_404(Subscription, pk=pk)
        count, _ = subscription.delete()
        if count == 0:
            return Response(
                {"detail": "No se ha podido anular la suscripción"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )
        return Response(
            {"detail": "Suscripción eliminada con éxito"}, status=status.HTTP_200_OK
        )


class SubscriptionByStudentView(views.APIView):
    permission_classes = [IsAuthenticated]
    serializer_class = SubscriptionSerializer

    def get(self, request, student_id):
        subscriptions = Subscription.objects.filter(user_id=student_id)
        serializer = self.serializer_class(subscriptions, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
