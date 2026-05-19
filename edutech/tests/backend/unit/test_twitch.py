from django.test import TestCase
from django.core.exceptions import ValidationError
from django.utils import timezone
from datetime import timedelta
from study_sessions.models import StudySession, TwitchCredential
from study_sessions.token_utils import encrypt
from ..config import make_student, make_course


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


def make_session(course, creator, **kw):
    kw.setdefault("twitch_link", "https://www.twitch.tv/teststreamer")
    kw.setdefault("description", "")
    return StudySession.objects.create(
        title=kw.pop("title", "Sesión de prueba"),
        scheduled_at=timezone.now() + timedelta(days=kw.pop("days_from_now", 1)),
        course=course,
        creator=creator,
        **kw,
    )


class TwitchCredentialModelTest(TestCase):

    def setUp(self):
        self.student = make_student()

    def test_create_stores_twitch_user_id(self):
        cred = make_twitch_credential(self.student, twitch_user_id="abc123")
        self.assertEqual(cred.twitch_user_id, "abc123")

    def test_create_stores_twitch_login(self):
        cred = make_twitch_credential(self.student, twitch_login="mystreamer")
        self.assertEqual(cred.twitch_login, "mystreamer")

    def test_create_stores_student(self):
        cred = make_twitch_credential(self.student)
        self.assertEqual(cred.student, self.student)

    def test_str_contains_login(self):
        cred = make_twitch_credential(self.student, twitch_login="teststreamer")
        self.assertIn("teststreamer", str(cred))

    def test_one_credential_per_student(self):
        make_twitch_credential(self.student)
        with self.assertRaises(Exception):
            make_twitch_credential(self.student)

    def test_different_students_can_have_separate_credentials(self):
        other = make_student(email="other@test.com")
        make_twitch_credential(self.student, twitch_login="streamer1")
        make_twitch_credential(other, twitch_login="streamer2")
        self.assertEqual(TwitchCredential.objects.count(), 2)

    def test_deleting_student_cascades_to_credential(self):
        make_twitch_credential(self.student)
        self.student.delete()
        self.assertEqual(TwitchCredential.objects.count(), 0)


class StudySessionStatusModelTest(TestCase):

    def setUp(self):
        self.student = make_student()
        self.course = make_course()

    def test_default_status_is_proxima(self):
        session = make_session(self.course, self.student)
        self.assertEqual(session.status, StudySession.STATUS_UPCOMING)

    def test_status_can_be_set_to_live(self):
        session = make_session(self.course, self.student, status=StudySession.STATUS_LIVE)
        self.assertEqual(session.status, StudySession.STATUS_LIVE)

    def test_status_can_be_set_to_ended(self):
        session = make_session(self.course, self.student, status=StudySession.STATUS_ENDED)
        self.assertEqual(session.status, StudySession.STATUS_ENDED)

    def test_stream_task_id_defaults_to_empty(self):
        session = make_session(self.course, self.student)
        self.assertEqual(session.stream_task_id, "")

    def test_broadcaster_twitch_id_defaults_to_empty(self):
        session = make_session(self.course, self.student)
        self.assertEqual(session.broadcaster_twitch_id, "")

    def test_twitch_link_is_optional(self):
        session = make_session(self.course, self.student, twitch_link="")
        self.assertEqual(session.twitch_link, "")

    def test_twitch_link_stores_valid_url(self):
        session = make_session(self.course, self.student, twitch_link="https://www.twitch.tv/micanal")
        self.assertEqual(session.twitch_link, "https://www.twitch.tv/micanal")


class TwitchUrlValidatorTest(TestCase):

    def setUp(self):
        self.student = make_student()
        self.course = make_course()

    def _build_session(self, twitch_link):
        return StudySession(
            title="Sesión",
            scheduled_at=timezone.now() + timedelta(days=1),
            course=self.course,
            creator=self.student,
            twitch_link=twitch_link,
        )

    def test_valid_twitch_link_passes_validation(self):
        session = self._build_session("https://www.twitch.tv/micanal")
        session.full_clean(exclude=["participants", "stream_task_id", "broadcaster_twitch_id"])

    def test_twitch_link_without_www_passes_validation(self):
        session = self._build_session("https://twitch.tv/micanal")
        session.full_clean(exclude=["participants", "stream_task_id", "broadcaster_twitch_id"])

    def test_empty_twitch_link_passes_validation(self):
        session = self._build_session("")
        session.full_clean(exclude=["participants", "stream_task_id", "broadcaster_twitch_id"])

    def test_non_twitch_url_raises_validation_error(self):
        session = self._build_session("https://www.youtube.com/micanal")
        with self.assertRaises(ValidationError):
            session.full_clean(exclude=["participants", "stream_task_id", "broadcaster_twitch_id"])

    def test_malformed_url_raises_validation_error(self):
        session = self._build_session("not-a-url")
        with self.assertRaises(ValidationError):
            session.full_clean(exclude=["participants", "stream_task_id", "broadcaster_twitch_id"])
