from django.test import override_settings
from rest_framework.test import APITestCase
from documents.models import Post
from ..config import TEST_STORAGES, make_student, make_course, make_post, login_student


@override_settings(STORAGES=TEST_STORAGES)
class PostDetailViewTest(APITestCase):

    def setUp(self):
        self.student = make_student()
        login_student(self.client, self.student)
        self.course = make_course()
        self.post = make_post(student=self.student, course=self.course)

    def test_get_returns_200(self):
        response = self.client.get(f'/documents/{self.post.pk}')
        self.assertEqual(response.status_code, 200)

    def test_get_returns_post_fields(self):
        response = self.client.get(f'/documents/{self.post.pk}')
        self.assertEqual(response.data['id'], self.post.pk)
        self.assertEqual(response.data['title'], self.post.title)

    def test_get_increments_view_count(self):
        self.client.get(f'/documents/{self.post.pk}')
        self.post.refresh_from_db()
        self.assertEqual(self.post.views, 1)

    def test_get_increments_view_count_on_each_request(self):
        self.client.get(f'/documents/{self.post.pk}')
        self.client.get(f'/documents/{self.post.pk}')
        self.post.refresh_from_db()
        self.assertEqual(self.post.views, 2)

    def test_get_nonexistent_returns_404(self):
        response = self.client.get('/documents/99999')
        self.assertEqual(response.status_code, 404)


@override_settings(STORAGES=TEST_STORAGES)
class PostDeleteViewTest(APITestCase):

    def setUp(self):
        self.student = make_student()
        login_student(self.client, self.student)
        self.course = make_course()

    def test_delete_own_post_returns_204(self):
        post = make_post(student=self.student, course=self.course)
        response = self.client.delete(f'/documents/delete/{post.pk}/')
        self.assertEqual(response.status_code, 204)

    def test_delete_own_post_removes_from_db(self):
        post = make_post(student=self.student, course=self.course)
        self.client.delete(f'/documents/delete/{post.pk}/')
        self.assertFalse(Post.objects.filter(pk=post.pk).exists())

    def test_delete_other_students_post_returns_404(self):
        other = make_student(email='other@test.com')
        post = make_post(student=other, course=self.course)
        response = self.client.delete(f'/documents/delete/{post.pk}/')
        self.assertEqual(response.status_code, 404)

    def test_delete_other_students_post_leaves_it_in_db(self):
        other = make_student(email='other@test.com')
        post = make_post(student=other, course=self.course)
        self.client.delete(f'/documents/delete/{post.pk}/')
        self.assertTrue(Post.objects.filter(pk=post.pk).exists())

    def test_delete_nonexistent_returns_404(self):
        response = self.client.delete('/documents/delete/99999/')
        self.assertEqual(response.status_code, 404)


@override_settings(STORAGES=TEST_STORAGES)
class MyPostListViewTest(APITestCase):

    def setUp(self):
        self.student = make_student()
        login_student(self.client, self.student)
        self.course = make_course()

    def test_returns_200(self):
        response = self.client.get('/documents/my/')
        self.assertEqual(response.status_code, 200)

    def test_empty_when_no_posts(self):
        response = self.client.get('/documents/my/')
        self.assertEqual(response.data, [])

    def test_returns_only_own_posts(self):
        make_post(student=self.student, course=self.course, title='Mine')
        other = make_student(email='other@test.com')
        make_post(student=other, course=self.course, title='Theirs')
        response = self.client.get('/documents/my/')
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]['title'], 'Mine')

    def test_excludes_drafts(self):
        make_post(student=self.student, course=self.course, title='Published')
        make_post(student=self.student, course=self.course, title='Draft', is_draft=True)
        response = self.client.get('/documents/my/')
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]['title'], 'Published')

    def test_returns_multiple_own_posts(self):
        make_post(student=self.student, course=self.course, title='A')
        make_post(student=self.student, course=self.course, title='B')
        response = self.client.get('/documents/my/')
        self.assertEqual(len(response.data), 2)
