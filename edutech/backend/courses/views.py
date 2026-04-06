from rest_framework import generics, views
from rest_framework.response import Response
from rest_framework import status
from django.shortcuts import get_object_or_404
from .models import Course, Year, Subscription
from .serializers import CourseSerializer, YearSerializer, SubscriptionSerializer
from users.models import Student


class YearListCreate(generics.ListCreateAPIView):
    queryset = Year.objects.all()
    serializer_class = YearSerializer


class CourseListCreate(generics.ListCreateAPIView):
    queryset = Course.objects.all()
    serializer_class = CourseSerializer
    filterset_fields = ['year', 'semester']

    def list(self, request, *args, **kwargs):
        year_id = request.query_params.get('year')
        if year_id is not None:
            get_object_or_404(Year, pk=year_id)
        return super().list(request, *args, **kwargs)


class CourseDetailView(views.APIView):
    def get(self, request, pk):
        course = get_object_or_404(Course, pk=pk)
        return Response(CourseSerializer(course).data, status=status.HTTP_200_OK)


class SubscriptionView(views.APIView):
    serializer_class = SubscriptionSerializer

    def get(self, request):
        user = request.query_params.get('user')
        course = request.query_params.get('course')

        subscription = Subscription.objects.filter(user=user, course=course).first()
        if subscription:
            return Response({"id": subscription.id}, status=status.HTTP_200_OK)
        return Response({}, status=status.HTTP_200_OK)

    def post(self, request):
        user = get_object_or_404(Student, pk=request.data.get('user'))
        course = get_object_or_404(Course, pk=request.data.get('course'))
        _, created = Subscription.objects.get_or_create(user=user, course=course)
        if not created:
            return Response({"detail": "Ya estás suscrito a este curso."}, status=status.HTTP_200_OK)
        return Response({"subscribed": True}, status=status.HTTP_201_CREATED)

    def delete(self, request, pk):
        subscription = get_object_or_404(Subscription, pk=pk)
        count, _ = subscription.delete()
        if count == 0:
            return Response({"detail": "No se ha podido anular la suscripción"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        return Response({"detail": "Suscripción eliminada con éxito"}, status=status.HTTP_200_OK)