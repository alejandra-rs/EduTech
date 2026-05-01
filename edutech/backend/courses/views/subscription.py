from rest_framework import views
from rest_framework.response import Response
from rest_framework import status
from django.shortcuts import get_object_or_404
from ..serializers import SubscriptionSerializer
from ..models import Course, Subscription
from users.models import Student


class SubscriptionView(views.APIView):
    serializer_class = SubscriptionSerializer

    def get(self, request):
        user = request.query_params.get("user")
        course = request.query_params.get("course")

        if not user:
            return Response(
                {"detail": "Se requiere el parámetro user."},
                status=status.HTTP_400_BAD_REQUEST,
            )
        if course:
            subscription = Subscription.objects.filter(user=user, course=course).first()
            return Response(
                {"id": subscription.id} if subscription else {},
                status=status.HTTP_200_OK,
            )

        subscriptions = Subscription.objects.filter(user_id=user).select_related(
            "course__year"
        )
        serializer = self.serializer_class(subscriptions, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request):
        user = get_object_or_404(Student, pk=request.data.get("user"))
        course = get_object_or_404(Course, pk=request.data.get("course"))
        _, created = Subscription.objects.get_or_create(user=user, course=course)
        if not created:
            return Response(
                {"detail": "Ya estás suscrito a este curso."}, status=status.HTTP_200_OK
            )
        return Response({"subscribed": True}, status=status.HTTP_201_CREATED)

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
    serializer_class = SubscriptionSerializer

    def get(self, request, student_id):
        subscriptions = Subscription.objects.filter(user_id=student_id)
        serializer = self.serializer_class(subscriptions, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
