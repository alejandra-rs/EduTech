from django.test import TestCase
from django.utils import timezone
from datetime import timedelta
from courses.models import StudySession, StudySessionComment
from ..config import make_student, make_course


def make_session(course, creator, title="Repaso Kanban", days_from_now=1, **kw):
    return StudySession.objects.create(
        title=title,
        description=kw.pop("description", ""),
        scheduled_at=timezone.now() + timedelta(days=days_from_now),
        course=course,
        creator=creator,
        **kw,
    )


class StudySessionModelTest(TestCase):

    def setUp(self):
        self.student = make_student()
        self.course = make_course()

    def test_create_stores_all_fields(self):
        scheduled = timezone.now() + timedelta(days=3)
        session = StudySession.objects.create(
            title="Repaso final",
            description="Vamos a repasar todo el temario",
            scheduled_at=scheduled,
            course=self.course,
            creator=self.student,
        )
        self.assertEqual(session.title, "Repaso final")
        self.assertEqual(session.description, "Vamos a repasar todo el temario")
        self.assertEqual(session.scheduled_at, scheduled)
        self.assertEqual(session.course, self.course)
        self.assertEqual(session.creator, self.student)

    def test_created_at_is_set_automatically(self):
        session = make_session(self.course, self.student)
        self.assertIsNotNone(session.created_at)

    def test_description_is_optional(self):
        session = StudySession.objects.create(
            title="Sin descripción",
            scheduled_at=timezone.now() + timedelta(days=1),
            course=self.course,
            creator=self.student,
        )
        self.assertEqual(session.description, "")

    def test_str_contains_title_and_course(self):
        session = make_session(self.course, self.student, title="Estudio grupal")
        result = str(session)
        self.assertIn("Estudio grupal", result)
        self.assertIn(self.course.name, result)

    def test_ordering_is_chronological(self):
        make_session(self.course, self.student, title="Sesión tardía", days_from_now=5)
        make_session(self.course, self.student, title="Sesión temprana", days_from_now=1)
        make_session(self.course, self.student, title="Sesión intermedia", days_from_now=3)
        titles = list(StudySession.objects.values_list("title", flat=True))
        self.assertEqual(titles, ["Sesión temprana", "Sesión intermedia", "Sesión tardía"])

    def test_deleting_course_cascades_to_sessions(self):
        make_session(self.course, self.student)
        self.course.delete()
        self.assertEqual(StudySession.objects.count(), 0)

    def test_deleting_creator_cascades_to_sessions(self):
        make_session(self.course, self.student)
        self.student.delete()
        self.assertEqual(StudySession.objects.count(), 0)

    def test_multiple_sessions_per_course_allowed(self):
        make_session(self.course, self.student, title="Sesión 1", days_from_now=1)
        make_session(self.course, self.student, title="Sesión 2", days_from_now=2)
        self.assertEqual(StudySession.objects.filter(course=self.course).count(), 2)

    def test_add_participant_to_session(self):
        session = make_session(self.course, self.student)
        participant = make_student(email="otro@test.com")
        session.participants.add(participant)
        self.assertIn(participant, session.participants.all())

    def test_remove_participant_from_session(self):
        session = make_session(self.course, self.student)
        participant = make_student(email="otro@test.com")
        session.participants.add(participant)
        session.participants.remove(participant)
        self.assertNotIn(participant, session.participants.all())

    def test_participants_starts_empty(self):
        session = make_session(self.course, self.student)
        self.assertEqual(session.participants.count(), 0)

    def test_multiple_participants_allowed(self):
        session = make_session(self.course, self.student)
        p1 = make_student(email="p1@test.com")
        p2 = make_student(email="p2@test.com")
        session.participants.add(p1, p2)
        self.assertEqual(session.participants.count(), 2)

    def test_deleting_session_removes_participants_relation(self):
        session = make_session(self.course, self.student)
        p = make_student(email="p@test.com")
        session.participants.add(p)
        session.delete()
        self.assertEqual(StudySession.objects.count(), 0)

    def test_create_comment(self):
        session = make_session(self.course, self.student)
        comment = StudySessionComment.objects.create(
            session=session, student=self.student, message="Gran sesión"
        )
        self.assertEqual(comment.message, "Gran sesión")
        self.assertEqual(comment.session, session)
        self.assertEqual(comment.student, self.student)

    def test_comment_created_at_is_set_automatically(self):
        session = make_session(self.course, self.student)
        comment = StudySessionComment.objects.create(
            session=session, student=self.student, message="Hola"
        )
        self.assertIsNotNone(comment.created_at)

    def test_comments_ordered_chronologically(self):
        session = make_session(self.course, self.student)
        c1 = StudySessionComment.objects.create(session=session, student=self.student, message="Primero")
        c2 = StudySessionComment.objects.create(session=session, student=self.student, message="Segundo")
        comments = list(session.session_comments.values_list("message", flat=True))
        self.assertEqual(comments, ["Primero", "Segundo"])

    def test_deleting_session_cascades_to_comments(self):
        session = make_session(self.course, self.student)
        StudySessionComment.objects.create(session=session, student=self.student, message="Hola")
        session.delete()
        self.assertEqual(StudySessionComment.objects.count(), 0)

    def test_multiple_comments_per_session_allowed(self):
        session = make_session(self.course, self.student)
        StudySessionComment.objects.create(session=session, student=self.student, message="A")
        StudySessionComment.objects.create(session=session, student=self.student, message="B")
        self.assertEqual(session.session_comments.count(), 2)
