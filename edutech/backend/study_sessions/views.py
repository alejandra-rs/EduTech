import json
import re

import httpx
from celery.result import AsyncResult
from django.conf import settings
from django.db.models import Q
from django.http import HttpResponse
from django.shortcuts import get_object_or_404
from django.utils import timezone
from rest_framework import views, status
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync

from courses.models import Course
from users.models import Student

from .models import StudySession, StudySessionComment, TwitchCredential
from .serializers import StudySessionSerializer, StudySessionCommentSerializer
from .tasks import connect_to_twitch_eventsub

_POPUP_HTML = """<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body>
<script>
  if (window.opener) {{
    window.opener.postMessage(
      {{ type: "{type}", payload: {payload} }},
      window.opener.location.origin
    );
  }}
  window.close();
</script>
</body>
</html>"""


def _get_broadcaster_id_sync(twitch_link: str, access_token: str) -> str:
    match = re.search(r"twitch\.tv/([a-zA-Z0-9_]+)", twitch_link)
    login = match.group(1) if match else ""
    resp = httpx.get(
        "https://api.twitch.tv/helix/users",
        params={"login": login},
        headers={
            "Client-Id": settings.TWITCH_CLIENT_ID,
            "Authorization": f"Bearer {access_token}",
        },
    )
    resp.raise_for_status()
    return resp.json()["data"][0]["id"]


class StudySessionListCreateView(views.APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        qs = StudySession.objects.select_related("creator", "course").filter(
            scheduled_at__gte=timezone.now()
        )

        course_ids = request.query_params.getlist("courses")
        no_course = request.query_params.get("no_course") == "true"
        include_no_course = request.query_params.get("include_no_course") == "true"

        if include_no_course:
            course_filter = Q(course__isnull=True)
            if course_ids:
                course_filter |= Q(course_id__in=course_ids)
            qs = qs.filter(course_filter)
        elif no_course:
            qs = qs.filter(course__isnull=True)
        elif course_ids:
            qs = qs.filter(course_id__in=course_ids)

        student = get_object_or_404(Student, email=request.user.email)

        if request.query_params.get("starred") == "true":
            qs = qs.filter(
                Q(creator_id=student.pk) | Q(participants__id=student.pk)
            ).distinct()

        serializer = StudySessionSerializer(
            qs, many=True, context={"student_id": student.pk}
        )
        return Response(serializer.data)

    def post(self, request):
        title = request.data.get("title", "").strip()
        description = request.data.get("description", "").strip()
        scheduled_at = request.data.get("scheduled_at")
        course_id = request.data.get("course")
        twitch_link = request.data.get("twitch_link", "").strip()

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
        if not twitch_link:
            return Response(
                {"detail": "Falta el enlace de Twitch."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        course = get_object_or_404(Course, pk=course_id) if course_id else None
        creator = get_object_or_404(Student, email=request.user.email)

        session = StudySession(
            title=title,
            description=description,
            scheduled_at=scheduled_at,
            course=course,
            creator=creator,
            twitch_link=twitch_link,
        )
        try:
            session.full_clean(
                exclude=["participants", "stream_task_id", "broadcaster_twitch_id"]
            )
        except Exception as exc:
            return Response({"detail": str(exc)}, status=status.HTTP_400_BAD_REQUEST)

        session.save()
        return Response(
            StudySessionSerializer(session).data, status=status.HTTP_201_CREATED
        )


class StudySessionDetailView(views.APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, pk):
        session = get_object_or_404(
            StudySession.objects.select_related("creator", "course"), pk=pk
        )
        student = get_object_or_404(Student, email=request.user.email)
        return Response(
            StudySessionSerializer(session, context={"student_id": student.pk}).data
        )

    def delete(self, request, pk):
        session = get_object_or_404(StudySession, pk=pk)
        if session.stream_task_id:
            AsyncResult(session.stream_task_id).revoke(terminate=True)
        session.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


class StudySessionStarView(views.APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, pk):
        session = get_object_or_404(StudySession, pk=pk)
        student = get_object_or_404(Student, email=request.user.email)
        session.participants.add(student)
        return Response(status=status.HTTP_200_OK)

    def delete(self, request, pk):
        session = get_object_or_404(StudySession, pk=pk)
        student = get_object_or_404(Student, email=request.user.email)
        session.participants.remove(student)
        return Response(status=status.HTTP_204_NO_CONTENT)


class StudySessionCommentView(views.APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, pk):
        session = get_object_or_404(StudySession, pk=pk)
        comments = session.session_comments.select_related("student")
        return Response(StudySessionCommentSerializer(comments, many=True).data)

    def post(self, request, pk):
        session = get_object_or_404(StudySession, pk=pk)
        message = request.data.get("message", "").strip()
        if not message:
            return Response(
                {"detail": "El mensaje no puede estar vacío."},
                status=status.HTTP_400_BAD_REQUEST,
            )
        student = get_object_or_404(Student, email=request.user.email)
        comment = StudySessionComment.objects.create(
            session=session, student=student, message=message
        )
        return Response(
            StudySessionCommentSerializer(comment).data, status=status.HTTP_201_CREATED
        )


class StreamView(views.APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, pk):
        session = get_object_or_404(StudySession, pk=pk)

        if not session.twitch_link:
            return Response(
                {"detail": "Esta sesión no tiene un enlace de Twitch configurado."},
                status=status.HTTP_400_BAD_REQUEST,
            )
        if session.stream_task_id:
            return Response(
                {
                    "detail": "El stream ya está en marcha.",
                    "task_id": session.stream_task_id,
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        student = get_object_or_404(Student, email=request.user.email)
        try:
            credential = TwitchCredential.objects.get(student=student)
        except TwitchCredential.DoesNotExist:
            return Response(
                {
                    "detail": "Debes conectar tu cuenta de Twitch para iniciar el stream.",
                    "code": "NOT_LINKED",
                },
                status=status.HTTP_403_FORBIDDEN,
            )

        from .token_utils import get_valid_access_token

        access_token = get_valid_access_token(credential)

        if not session.broadcaster_twitch_id:
            session.broadcaster_twitch_id = _get_broadcaster_id_sync(
                session.twitch_link, access_token
            )
            session.save(update_fields=["broadcaster_twitch_id"])

        task = connect_to_twitch_eventsub.delay(
            session.id,
            session.broadcaster_twitch_id,
            access_token,
            credential.twitch_user_id,
        )
        session.stream_task_id = task.id
        session.status = StudySession.STATUS_LIVE
        session.save(update_fields=["stream_task_id", "status"])

        channel_layer = get_channel_layer()
        async_to_sync(channel_layer.group_send)(
            f"study_session_{pk}",
            {"type": "stream_started"},
        )
        return Response({"task_id": task.id}, status=status.HTTP_201_CREATED)

    def delete(self, request, pk):
        session = get_object_or_404(StudySession, pk=pk)
        if session.stream_task_id:
            AsyncResult(session.stream_task_id).revoke(terminate=True)
            session.stream_task_id = ""
        session.status = StudySession.STATUS_ENDED
        session.save(update_fields=["stream_task_id", "status"])

        channel_layer = get_channel_layer()
        async_to_sync(channel_layer.group_send)(
            f"study_session_{pk}",
            {"type": "stream_ended"},
        )
        return Response(status=status.HTTP_204_NO_CONTENT)


class TwitchAuthView(views.APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        student = get_object_or_404(Student, email=request.user.email)
        from .oauth import build_auth_url

        return Response({"url": build_auth_url(student.pk)})


class TwitchCallbackView(views.APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        code = request.query_params.get("code")
        state = request.query_params.get("state")
        error = request.query_params.get("error")

        if error or not code or not state:
            return HttpResponse(
                _POPUP_HTML.format(
                    type="TWITCH_AUTH_ERROR",
                    payload=json.dumps({"error": error or "missing_params"}),
                ),
                content_type="text/html",
            )

        try:
            from .oauth import handle_callback

            credential = handle_callback(code, state)
            return HttpResponse(
                _POPUP_HTML.format(
                    type="TWITCH_AUTH_SUCCESS",
                    payload=json.dumps({"login": credential.twitch_login}),
                ),
                content_type="text/html",
            )
        except Exception as exc:
            return HttpResponse(
                _POPUP_HTML.format(
                    type="TWITCH_AUTH_ERROR",
                    payload=json.dumps({"error": str(exc)}),
                ),
                content_type="text/html",
            )


class TwitchStatusView(views.APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        student = get_object_or_404(Student, email=request.user.email)
        try:
            cred = TwitchCredential.objects.get(student=student)
            return Response({"connected": True, "login": cred.twitch_login})
        except TwitchCredential.DoesNotExist:
            return Response({"connected": False, "login": None})

    def delete(self, request):
        student = get_object_or_404(Student, email=request.user.email)
        TwitchCredential.objects.filter(student=student).delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


class TwitchSendMessageView(views.APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, pk):
        session = get_object_or_404(StudySession, pk=pk)
        message = request.data.get("message", "").strip()

        if not message:
            return Response(
                {"detail": "Falta el mensaje."}, status=status.HTTP_400_BAD_REQUEST
            )
        if not session.twitch_link:
            return Response(
                {"detail": "Esta sesión no tiene canal de Twitch."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        student = get_object_or_404(Student, email=request.user.email)
        try:
            credential = TwitchCredential.objects.get(student=student)
        except TwitchCredential.DoesNotExist:
            return Response(
                {
                    "detail": "Debes conectar tu cuenta de Twitch para chatear.",
                    "code": "NOT_LINKED",
                },
                status=status.HTTP_403_FORBIDDEN,
            )

        from .token_utils import get_valid_access_token

        access_token = get_valid_access_token(credential)

        broadcaster_id = session.broadcaster_twitch_id
        if not broadcaster_id:
            broadcaster_id = _get_broadcaster_id_sync(session.twitch_link, access_token)
            session.broadcaster_twitch_id = broadcaster_id
            session.save(update_fields=["broadcaster_twitch_id"])

        resp = httpx.post(
            "https://api.twitch.tv/helix/chat/messages",
            headers={
                "Client-Id": settings.TWITCH_CLIENT_ID,
                "Authorization": f"Bearer {access_token}",
                "Content-Type": "application/json",
            },
            json={
                "broadcaster_id": broadcaster_id,
                "sender_id": credential.twitch_user_id,
                "message": message,
            },
        )

        if resp.status_code == 401:
            return Response(
                {
                    "detail": "Token de Twitch inválido. Reconecta tu cuenta.",
                    "code": "INVALID_TOKEN",
                },
                status=status.HTTP_401_UNAUTHORIZED,
            )
        resp.raise_for_status()
        return Response(status=status.HTTP_204_NO_CONTENT)
