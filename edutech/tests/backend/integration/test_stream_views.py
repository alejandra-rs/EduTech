from unittest.mock import patch, MagicMock
from rest_framework.test import APITestCase
from django.utils import timezone
from datetime import timedelta
from study_sessions.models import StudySession, TwitchCredential
from study_sessions.token_utils import encrypt
from ..config import make_student, make_course


def make_session(course, creator, **kw):
    kw.setdefault("twitch_link", "https://www.twitch.tv/teststreamer")
    kw.setdefault("broadcaster_twitch_id", "123456")
    kw.setdefault("description", "")
    return StudySession.objects.create(
        title=kw.pop("title", "Repaso Kanban"),
        scheduled_at=timezone.now() + timedelta(days=kw.pop("days_from_now", 1)),
        course=course,
        creator=creator,
        **kw,
    )


def make_twitch_credential(student, **kw):
    defaults = {
        "twitch_user_id": "123456",
        "twitch_login": "teststreamer",
        "access_token": encrypt("fake_access_token"),
        "refresh_token": encrypt("fake_refresh_token"),
        "token_expires_at": timezone.now() + timedelta(hours=4),
    }
    defaults.update(kw)
    return TwitchCredential.objects.create(student=student, **defaults)


# Replaces async_to_sync so channel layer calls are no-ops in tests
def _noop_async_to_sync(fn):
    return lambda *args, **kwargs: None


class TwitchStatusViewTest(APITestCase):

    def setUp(self):
        self.student = make_student()
        self.url = "/study-sessions/twitch/status/"

    def test_get_connected_student_returns_200(self):
        make_twitch_credential(self.student)
        response = self.client.get(self.url, {"student_id": self.student.pk})
        self.assertEqual(response.status_code, 200)

    def test_get_connected_student_returns_connected_true(self):
        make_twitch_credential(self.student)
        response = self.client.get(self.url, {"student_id": self.student.pk})
        self.assertTrue(response.data["connected"])

    def test_get_connected_student_returns_twitch_login(self):
        make_twitch_credential(self.student, twitch_login="mystreamer")
        response = self.client.get(self.url, {"student_id": self.student.pk})
        self.assertEqual(response.data["login"], "mystreamer")

    def test_get_unconnected_student_returns_connected_false(self):
        response = self.client.get(self.url, {"student_id": self.student.pk})
        self.assertFalse(response.data["connected"])

    def test_get_unconnected_student_returns_null_login(self):
        response = self.client.get(self.url, {"student_id": self.student.pk})
        self.assertIsNone(response.data["login"])

    def test_get_response_includes_connected_and_login_fields(self):
        response = self.client.get(self.url, {"student_id": self.student.pk})
        self.assertIn("connected", response.data)
        self.assertIn("login", response.data)

    def test_delete_credential_returns_204(self):
        make_twitch_credential(self.student)
        response = self.client.delete(f"{self.url}?student_id={self.student.pk}")
        self.assertEqual(response.status_code, 204)

    def test_delete_credential_removes_it_from_db(self):
        make_twitch_credential(self.student)
        self.client.delete(f"{self.url}?student_id={self.student.pk}")
        self.assertEqual(TwitchCredential.objects.count(), 0)

    def test_delete_nonexistent_credential_returns_204(self):
        response = self.client.delete(f"{self.url}?student_id={self.student.pk}")
        self.assertEqual(response.status_code, 204)


class StreamViewStartTest(APITestCase):
    """Escenario 1 — Inicio de retransmisión"""

    def setUp(self):
        self.student = make_student()
        self.course = make_course()
        self.session = make_session(self.course, self.student)
        self.credential = make_twitch_credential(self.student)
        self.url = f"/study-sessions/{self.session.pk}/stream/"

    @patch("study_sessions.views.async_to_sync", side_effect=_noop_async_to_sync)
    @patch("study_sessions.views.get_channel_layer")
    @patch("study_sessions.views.connect_to_twitch_eventsub")
    @patch("study_sessions.token_utils.get_valid_access_token", return_value="fake_token")
    def test_start_stream_returns_201(self, mock_token, mock_task, mock_layer, mock_async):
        mock_task.delay.return_value = MagicMock(id="fake-task-id")
        response = self.client.post(self.url, {"student_id": self.student.pk}, format="json")
        self.assertEqual(response.status_code, 201)

    @patch("study_sessions.views.async_to_sync", side_effect=_noop_async_to_sync)
    @patch("study_sessions.views.get_channel_layer")
    @patch("study_sessions.views.connect_to_twitch_eventsub")
    @patch("study_sessions.token_utils.get_valid_access_token", return_value="fake_token")
    def test_start_stream_changes_status_to_live(self, mock_token, mock_task, mock_layer, mock_async):
        mock_task.delay.return_value = MagicMock(id="fake-task-id")
        self.client.post(self.url, {"student_id": self.student.pk}, format="json")
        self.session.refresh_from_db()
        self.assertEqual(self.session.status, StudySession.STATUS_LIVE)

    @patch("study_sessions.views.async_to_sync", side_effect=_noop_async_to_sync)
    @patch("study_sessions.views.get_channel_layer")
    @patch("study_sessions.views.connect_to_twitch_eventsub")
    @patch("study_sessions.token_utils.get_valid_access_token", return_value="fake_token")
    def test_start_stream_response_includes_task_id(self, mock_token, mock_task, mock_layer, mock_async):
        mock_task.delay.return_value = MagicMock(id="fake-task-id")
        response = self.client.post(self.url, {"student_id": self.student.pk}, format="json")
        self.assertIn("task_id", response.data)

    @patch("study_sessions.views.async_to_sync", side_effect=_noop_async_to_sync)
    @patch("study_sessions.views.get_channel_layer")
    @patch("study_sessions.views.connect_to_twitch_eventsub")
    @patch("study_sessions.token_utils.get_valid_access_token", return_value="fake_token")
    def test_start_stream_saves_task_id_to_db(self, mock_token, mock_task, mock_layer, mock_async):
        mock_task.delay.return_value = MagicMock(id="fake-task-id")
        self.client.post(self.url, {"student_id": self.student.pk}, format="json")
        self.session.refresh_from_db()
        self.assertEqual(self.session.stream_task_id, "fake-task-id")

    def test_start_stream_without_twitch_credential_returns_403(self):
        self.credential.delete()
        response = self.client.post(self.url, {"student_id": self.student.pk}, format="json")
        self.assertEqual(response.status_code, 403)

    def test_start_stream_without_twitch_credential_returns_not_linked_code(self):
        self.credential.delete()
        response = self.client.post(self.url, {"student_id": self.student.pk}, format="json")
        self.assertEqual(response.data["code"], "NOT_LINKED")

    def test_start_stream_when_already_streaming_returns_400(self):
        self.session.stream_task_id = "existing-task-id"
        self.session.save(update_fields=["stream_task_id"])
        response = self.client.post(self.url, {"student_id": self.student.pk}, format="json")
        self.assertEqual(response.status_code, 400)

    def test_start_stream_without_twitch_link_returns_400(self):
        self.session.twitch_link = ""
        self.session.save(update_fields=["twitch_link"])
        response = self.client.post(self.url, {"student_id": self.student.pk}, format="json")
        self.assertEqual(response.status_code, 400)

    def test_start_stream_nonexistent_session_returns_404(self):
        response = self.client.post(
            "/study-sessions/99999/stream/", {"student_id": self.student.pk}, format="json"
        )
        self.assertEqual(response.status_code, 404)


class StreamViewEndTest(APITestCase):
    """Escenario 3 — Finalización de sesión en directo"""

    def setUp(self):
        self.student = make_student()
        self.course = make_course()
        self.session = make_session(
            self.course,
            self.student,
            status=StudySession.STATUS_LIVE,
            stream_task_id="existing-task-id",
        )
        self.url = f"/study-sessions/{self.session.pk}/stream/"

    @patch("study_sessions.views.async_to_sync", side_effect=_noop_async_to_sync)
    @patch("study_sessions.views.get_channel_layer")
    @patch("study_sessions.views.AsyncResult")
    def test_end_stream_returns_204(self, mock_result, mock_layer, mock_async):
        response = self.client.delete(self.url)
        self.assertEqual(response.status_code, 204)

    @patch("study_sessions.views.async_to_sync", side_effect=_noop_async_to_sync)
    @patch("study_sessions.views.get_channel_layer")
    @patch("study_sessions.views.AsyncResult")
    def test_end_stream_changes_status_to_finalizada(self, mock_result, mock_layer, mock_async):
        self.client.delete(self.url)
        self.session.refresh_from_db()
        self.assertEqual(self.session.status, StudySession.STATUS_ENDED)

    @patch("study_sessions.views.async_to_sync", side_effect=_noop_async_to_sync)
    @patch("study_sessions.views.get_channel_layer")
    @patch("study_sessions.views.AsyncResult")
    def test_end_stream_clears_task_id(self, mock_result, mock_layer, mock_async):
        self.client.delete(self.url)
        self.session.refresh_from_db()
        self.assertEqual(self.session.stream_task_id, "")

    def test_end_stream_nonexistent_session_returns_404(self):
        response = self.client.delete("/study-sessions/99999/stream/")
        self.assertEqual(response.status_code, 404)


class StudySessionDetailLiveStatusTest(APITestCase):
    """Escenarios 2 y 4 — Visualización con y sin retransmisión activa"""

    def setUp(self):
        self.student = make_student()
        self.course = make_course()

    def test_detail_live_session_returns_200(self):
        session = make_session(self.course, self.student, status=StudySession.STATUS_LIVE)
        response = self.client.get(f"/study-sessions/{session.pk}/")
        self.assertEqual(response.status_code, 200)

    def test_detail_live_session_returns_status_en_directo(self):
        session = make_session(self.course, self.student, status=StudySession.STATUS_LIVE)
        response = self.client.get(f"/study-sessions/{session.pk}/")
        self.assertEqual(response.data["status"], StudySession.STATUS_LIVE)

    def test_detail_live_session_returns_twitch_link(self):
        session = make_session(
            self.course, self.student,
            status=StudySession.STATUS_LIVE,
            twitch_link="https://www.twitch.tv/micanal",
        )
        response = self.client.get(f"/study-sessions/{session.pk}/")
        self.assertEqual(response.data["twitch_link"], "https://www.twitch.tv/micanal")

    def test_detail_response_includes_status_and_twitch_link_fields(self):
        session = make_session(self.course, self.student)
        response = self.client.get(f"/study-sessions/{session.pk}/")
        self.assertIn("status", response.data)
        self.assertIn("twitch_link", response.data)

    def test_detail_upcoming_session_status_is_proxima(self):
        session = make_session(self.course, self.student, status=StudySession.STATUS_UPCOMING)
        response = self.client.get(f"/study-sessions/{session.pk}/")
        self.assertEqual(response.data["status"], StudySession.STATUS_UPCOMING)

    def test_detail_ended_session_status_is_finalizada(self):
        session = make_session(self.course, self.student, status=StudySession.STATUS_ENDED)
        response = self.client.get(f"/study-sessions/{session.pk}/")
        self.assertEqual(response.data["status"], StudySession.STATUS_ENDED)

    def test_detail_session_without_twitch_link_returns_empty_twitch_link(self):
        session = make_session(self.course, self.student, twitch_link="")
        response = self.client.get(f"/study-sessions/{session.pk}/")
        self.assertEqual(response.data["twitch_link"], "")

    def test_detail_nonexistent_session_returns_404(self):
        response = self.client.get("/study-sessions/99999/")
        self.assertEqual(response.status_code, 404)
