from rest_framework.test import APITestCase
from ..config import make_student, make_course, make_post, make_root_folder, make_saved_post


class AuthEnforcementTest(APITestCase):
    """
    Every endpoint protected by IsAuthenticated must return 401 when no
    credentials are provided. These tests catch accidental removal of
    permission_classes from a view.
    """

    def setUp(self):
        self.student = make_student()
        self.course = make_course()

    def _assert_401(self, method, url, **kwargs):
        response = getattr(self.client, method)(url, **kwargs)
        self.assertEqual(
            response.status_code, 401,
            f"{method.upper()} {url} should return 401 without auth, got {response.status_code}",
        )

    def test_students_list_requires_auth(self):
        self._assert_401('get', '/students/')

    def test_students_me_get_requires_auth(self):
        self._assert_401('get', '/students/me/')

    def test_students_me_patch_requires_auth(self):
        self._assert_401('patch', '/students/me/', data={}, format='json')

    def test_students_me_delete_requires_auth(self):
        self._assert_401('delete', '/students/me/')

    def test_students_is_admin_requires_auth(self):
        self._assert_401('get', '/students/me/is-admin/')


    def test_post_list_requires_auth(self):
        self._assert_401('get', '/documents/')

    def test_post_detail_requires_auth(self):
        post = make_post(student=self.student, course=self.course)
        self._assert_401('get', f'/documents/{post.pk}')

    def test_post_delete_requires_auth(self):
        post = make_post(student=self.student, course=self.course)
        self._assert_401('delete', f'/documents/delete/{post.pk}/')

    def test_my_posts_requires_auth(self):
        self._assert_401('get', '/documents/my/')

    def test_drafts_list_requires_auth(self):
        self._assert_401('get', '/documents/drafts/')

    def test_revision_list_requires_auth(self):
        self._assert_401('get', '/documents/revision/')

    def test_comments_requires_auth(self):
        self._assert_401('get', '/documents/comments/')

    def test_likes_requires_auth(self):
        self._assert_401('post', '/documents/likes/', data={}, format='json')


    def test_courses_list_requires_auth(self):
        self._assert_401('get', '/courses/')

    def test_years_list_requires_auth(self):
        self._assert_401('get', '/courses/years/')


    def test_folder_root_requires_auth(self):
        self._assert_401('get', '/student-space/folders/root/')

    def test_saved_posts_requires_auth(self):
        self._assert_401('post', '/student-space/posts/', data={}, format='json')

    def test_space_stats_requires_auth(self):
        self._assert_401('get', '/student-space/stats/')

    def test_pinned_posts_requires_auth(self):
        self._assert_401('get', '/student-space/pinned/')


    def test_study_sessions_list_requires_auth(self):
        self._assert_401('get', '/study-sessions/')

    def test_study_sessions_create_requires_auth(self):
        self._assert_401('post', '/study-sessions/', data={}, format='json')
