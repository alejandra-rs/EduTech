from rest_framework.test import APITestCase
from django.utils import timezone
from datetime import timedelta
from courses.models import StudySession, StudySessionComment
from ..config import make_student, make_course, make_year


def future(days=1):
    return (timezone.now() + timedelta(days=days)).isoformat()


def past(days=1):
    return (timezone.now() - timedelta(days=days)).isoformat()


class StudySessionCreateViewTest(APITestCase):

    def setUp(self):
        self.student = make_student()
        self.course = make_course()
        self.url = "/courses/study-sessions/"
        self.valid_payload = {
            "title": "Repaso Kanban",
            "description": "Vamos a repasar Kanban juntos",
            "scheduled_at": future(2),
            "course": self.course.pk,
            "creator": self.student.pk,
        }

    def test_create_session_returns_201(self):
        response = self.client.post(self.url, self.valid_payload, format="json")
        self.assertEqual(response.status_code, 201)
        self.assertEqual(StudySession.objects.count(), 1)

    def test_create_session_without_description_returns_201(self):
        payload = {**self.valid_payload, "description": ""}
        response = self.client.post(self.url, payload, format="json")
        self.assertEqual(response.status_code, 201)

    def test_create_session_response_includes_expected_fields(self):
        response = self.client.post(self.url, self.valid_payload, format="json")
        self.assertEqual(response.status_code, 201)
        for field in ("id", "title", "description", "scheduled_at", "created_at", "creator", "course", "participants", "is_starred"):
            self.assertIn(field, response.data)

    def test_create_session_response_creator_has_name(self):
        response = self.client.post(self.url, self.valid_payload, format="json")
        self.assertEqual(response.status_code, 201)
        self.assertIn("first_name", response.data["creator"])
        self.assertIn("last_name", response.data["creator"])

    def test_create_session_participants_starts_empty(self):
        response = self.client.post(self.url, self.valid_payload, format="json")
        self.assertEqual(response.status_code, 201)
        self.assertEqual(response.data["participants"], [])

    def test_create_session_without_title_returns_400(self):
        payload = {**self.valid_payload, "title": ""}
        response = self.client.post(self.url, payload, format="json")
        self.assertEqual(response.status_code, 400)
        self.assertEqual(StudySession.objects.count(), 0)

    def test_create_session_without_title_returns_correct_message(self):
        payload = {**self.valid_payload, "title": ""}
        response = self.client.post(self.url, payload, format="json")
        self.assertIn("No se ha indicado un título para la sesión", response.data["detail"])

    def test_create_session_whitespace_title_returns_400(self):
        payload = {**self.valid_payload, "title": "   "}
        response = self.client.post(self.url, payload, format="json")
        self.assertEqual(response.status_code, 400)

    def test_create_session_without_date_returns_400(self):
        payload = {**self.valid_payload, "scheduled_at": ""}
        response = self.client.post(self.url, payload, format="json")
        self.assertEqual(response.status_code, 400)
        self.assertEqual(StudySession.objects.count(), 0)

    def test_create_session_without_date_returns_correct_message(self):
        payload = {**self.valid_payload, "scheduled_at": ""}
        response = self.client.post(self.url, payload, format="json")
        self.assertIn("No se ha indicado una fecha para la sesión", response.data["detail"])

    def test_create_session_nonexistent_course_returns_404(self):
        payload = {**self.valid_payload, "course": 99999}
        response = self.client.post(self.url, payload, format="json")
        self.assertEqual(response.status_code, 404)

    def test_create_session_nonexistent_creator_returns_404(self):
        payload = {**self.valid_payload, "creator": 99999}
        response = self.client.post(self.url, payload, format="json")
        self.assertEqual(response.status_code, 404)


class StudySessionListViewTest(APITestCase):

    def setUp(self):
        self.year = make_year()
        self.student = make_student()
        self.course = make_course(year=self.year)
        self.other_course = make_course(name="Otra Asignatura", year=self.year)
        self.url = "/courses/study-sessions/"

    def _make_session(self, title, days=1, course=None):
        return StudySession.objects.create(
            title=title,
            scheduled_at=timezone.now() + timedelta(days=days),
            course=course or self.course,
            creator=self.student,
        )

    def test_list_sessions_for_course_returns_200(self):
        self._make_session("Sesión 1")
        response = self.client.get(self.url, {"courses": self.course.pk})
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.data), 1)

    def test_list_sessions_returns_all_without_course_filter(self):
        self._make_session("Sesión A")
        self._make_session("Sesión B", course=self.other_course)
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.data), 2)

    def test_list_sessions_filtered_by_course_excludes_others(self):
        self._make_session("Mi sesión")
        self._make_session("Otra sesión", course=self.other_course)
        response = self.client.get(self.url, {"courses": self.course.pk})
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]["title"], "Mi sesión")

    def test_list_sessions_filtered_by_multiple_courses(self):
        self._make_session("Sesión A")
        self._make_session("Sesión B", course=self.other_course)
        third_course = make_course(name="Tercera Asignatura", year=self.year)
        self._make_session("Sesión C", course=third_course)
        response = self.client.get(
            self.url + f"?courses={self.course.pk}&courses={self.other_course.pk}"
        )
        self.assertEqual(len(response.data), 2)

    def test_list_sessions_excludes_past_sessions(self):
        StudySession.objects.create(
            title="Pasada",
            scheduled_at=timezone.now() - timedelta(days=1),
            course=self.course,
            creator=self.student,
        )
        self._make_session("Futura")
        response = self.client.get(self.url, {"courses": self.course.pk})
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]["title"], "Futura")

    def test_list_sessions_ordered_chronologically(self):
        self._make_session("Tardía", days=5)
        self._make_session("Temprana", days=1)
        self._make_session("Intermedia", days=3)
        response = self.client.get(self.url, {"courses": self.course.pk})
        titles = [s["title"] for s in response.data]
        self.assertEqual(titles, ["Temprana", "Intermedia", "Tardía"])

    def test_list_sessions_each_entry_has_date_time_and_creator(self):
        self._make_session("Sesión con campos")
        response = self.client.get(self.url, {"courses": self.course.pk})
        session = response.data[0]
        self.assertIn("scheduled_at", session)
        self.assertIn("creator", session)
        self.assertIn("first_name", session["creator"])

    def test_list_sessions_empty_course_returns_empty_list(self):
        response = self.client.get(self.url, {"courses": self.course.pk})
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data, [])

    def test_list_sessions_each_entry_has_participants_and_is_starred(self):
        self._make_session("Sesión")
        response = self.client.get(self.url, {"courses": self.course.pk})
        session = response.data[0]
        self.assertIn("participants", session)
        self.assertIn("is_starred", session)

    def test_starred_filter_returns_sessions_where_user_is_creator(self):
        self._make_session("Mi sesión")
        other_student = make_student(email="otro@test.com")
        StudySession.objects.create(
            title="No es mía",
            scheduled_at=timezone.now() + timedelta(days=1),
            course=self.course,
            creator=other_student,
        )
        response = self.client.get(
            self.url, {"starred": "true", "student_id": self.student.pk}
        )
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]["title"], "Mi sesión")

    def test_starred_filter_returns_sessions_where_user_is_participant(self):
        other_student = make_student(email="otro@test.com")
        session = StudySession.objects.create(
            title="Sesión ajena",
            scheduled_at=timezone.now() + timedelta(days=1),
            course=self.course,
            creator=other_student,
        )
        session.participants.add(self.student)
        response = self.client.get(
            self.url, {"starred": "true", "student_id": self.student.pk}
        )
        self.assertEqual(len(response.data), 1)

    def test_starred_filter_without_student_id_returns_all(self):
        self._make_session("A")
        self._make_session("B")
        response = self.client.get(self.url, {"starred": "true"})
        self.assertEqual(len(response.data), 2)

    def test_is_starred_false_without_student_id(self):
        self._make_session("Sesión")
        response = self.client.get(self.url)
        self.assertFalse(response.data[0]["is_starred"])

    def test_is_starred_true_for_participant(self):
        other = make_student(email="other@test.com")
        session = self._make_session("Sesión")
        session.participants.add(other)
        response = self.client.get(self.url, {"student_id": other.pk})
        self.assertTrue(response.data[0]["is_starred"])


class StudySessionDeleteViewTest(APITestCase):

    def setUp(self):
        self.student = make_student()
        self.course = make_course()

    def _make_session(self):
        return StudySession.objects.create(
            title="Sesión a borrar",
            scheduled_at=timezone.now() + timedelta(days=1),
            course=self.course,
            creator=self.student,
        )

    def test_delete_session_returns_204(self):
        session = self._make_session()
        response = self.client.delete(f"/courses/study-sessions/{session.pk}/")
        self.assertEqual(response.status_code, 204)

    def test_delete_session_removes_from_db(self):
        session = self._make_session()
        self.client.delete(f"/courses/study-sessions/{session.pk}/")
        self.assertEqual(StudySession.objects.count(), 0)

    def test_delete_nonexistent_session_returns_404(self):
        response = self.client.delete("/courses/study-sessions/99999/")
        self.assertEqual(response.status_code, 404)


class StudySessionStarViewTest(APITestCase):

    def setUp(self):
        self.student = make_student()
        self.course = make_course()
        self.session = StudySession.objects.create(
            title="Sesión",
            scheduled_at=timezone.now() + timedelta(days=1),
            course=self.course,
            creator=make_student(email="creator@test.com"),
        )
        self.star_url = f"/courses/study-sessions/{self.session.pk}/star/"

    def test_star_session_returns_200(self):
        response = self.client.post(self.star_url, {"student_id": self.student.pk}, format="json")
        self.assertEqual(response.status_code, 200)

    def test_star_session_adds_participant(self):
        self.client.post(self.star_url, {"student_id": self.student.pk}, format="json")
        self.assertIn(self.student, self.session.participants.all())

    def test_star_session_without_student_id_returns_400(self):
        response = self.client.post(self.star_url, {}, format="json")
        self.assertEqual(response.status_code, 400)

    def test_star_session_nonexistent_student_returns_404(self):
        response = self.client.post(self.star_url, {"student_id": 99999}, format="json")
        self.assertEqual(response.status_code, 404)

    def test_star_nonexistent_session_returns_404(self):
        response = self.client.post("/courses/study-sessions/99999/star/", {"student_id": self.student.pk}, format="json")
        self.assertEqual(response.status_code, 404)

    def test_unstar_session_returns_204(self):
        self.session.participants.add(self.student)
        response = self.client.delete(f"{self.star_url}?student_id={self.student.pk}")
        self.assertEqual(response.status_code, 204)

    def test_unstar_session_removes_participant(self):
        self.session.participants.add(self.student)
        self.client.delete(f"{self.star_url}?student_id={self.student.pk}")
        self.assertNotIn(self.student, self.session.participants.all())

    def test_unstar_session_without_student_id_returns_400(self):
        response = self.client.delete(self.star_url)
        self.assertEqual(response.status_code, 400)


class StudySessionCommentViewTest(APITestCase):

    def setUp(self):
        self.student = make_student()
        self.course = make_course()
        self.session = StudySession.objects.create(
            title="Sesión",
            scheduled_at=timezone.now() + timedelta(days=1),
            course=self.course,
            creator=self.student,
        )
        self.comments_url = f"/courses/study-sessions/{self.session.pk}/comments/"

    def test_get_comments_returns_200(self):
        response = self.client.get(self.comments_url)
        self.assertEqual(response.status_code, 200)

    def test_get_comments_empty_initially(self):
        response = self.client.get(self.comments_url)
        self.assertEqual(response.data, [])

    def test_post_comment_returns_201(self):
        payload = {"student_id": self.student.pk, "message": "Gran sesión"}
        response = self.client.post(self.comments_url, payload, format="json")
        self.assertEqual(response.status_code, 201)

    def test_post_comment_stores_message(self):
        self.client.post(self.comments_url, {"student_id": self.student.pk, "message": "Hola"}, format="json")
        self.assertEqual(StudySessionComment.objects.count(), 1)
        self.assertEqual(StudySessionComment.objects.first().message, "Hola")

    def test_post_comment_response_includes_expected_fields(self):
        response = self.client.post(self.comments_url, {"student_id": self.student.pk, "message": "Test"}, format="json")
        for field in ("id", "student", "message", "created_at"):
            self.assertIn(field, response.data)

    def test_post_comment_response_student_has_name(self):
        response = self.client.post(self.comments_url, {"student_id": self.student.pk, "message": "Test"}, format="json")
        self.assertIn("first_name", response.data["student"])

    def test_get_comments_lists_all(self):
        StudySessionComment.objects.create(session=self.session, student=self.student, message="A")
        StudySessionComment.objects.create(session=self.session, student=self.student, message="B")
        response = self.client.get(self.comments_url)
        self.assertEqual(len(response.data), 2)

    def test_post_comment_without_student_id_returns_400(self):
        response = self.client.post(self.comments_url, {"message": "Hola"}, format="json")
        self.assertEqual(response.status_code, 400)

    def test_post_comment_empty_message_returns_400(self):
        response = self.client.post(self.comments_url, {"student_id": self.student.pk, "message": ""}, format="json")
        self.assertEqual(response.status_code, 400)
        self.assertIn("El mensaje no puede estar vacío.", response.data["detail"])

    def test_post_comment_nonexistent_student_returns_404(self):
        response = self.client.post(self.comments_url, {"student_id": 99999, "message": "Hola"}, format="json")
        self.assertEqual(response.status_code, 404)

    def test_comments_on_nonexistent_session_returns_404(self):
        response = self.client.get("/courses/study-sessions/99999/comments/")
        self.assertEqual(response.status_code, 404)
