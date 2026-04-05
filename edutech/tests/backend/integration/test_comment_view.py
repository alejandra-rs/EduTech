from django.test import override_settings
from rest_framework.test import APITestCase
from documents.models import Post, PDFAttachment, Comment
from ..config import TEST_STORAGES, make_student, make_course, make_pdf_file


@override_settings(STORAGES=TEST_STORAGES)
class CommentViewTest(APITestCase):

    def setUp(self):
        self.student = make_student()
        self.course  = make_course()
        self.post = Post.objects.create(
            course=self.course, student=self.student,
            title='T', description='D', post_type='PDF',
        )
        PDFAttachment.objects.create(post=self.post, file=make_pdf_file())

    def test_create_comment_returns_201(self):
        response = self.client.post(
            f'/documents/comments/?post={self.post.pk}&user={self.student.pk}',
            {'message': 'Great content!'},
            format='json',
        )
        self.assertEqual(response.status_code, 201)
        self.assertEqual(Comment.objects.count(), 1)

    def test_create_empty_comment_returns_400(self):
        response = self.client.post(
            f'/documents/comments/?post={self.post.pk}&user={self.student.pk}',
            {'message': ''},
            format='json',
        )
        self.assertEqual(response.status_code, 400)
        self.assertEqual(Comment.objects.count(), 0)

    def test_create_whitespace_only_comment_returns_400(self):
        response = self.client.post(
            f'/documents/comments/?post={self.post.pk}&user={self.student.pk}',
            {'message': '   '},
            format='json',
        )
        self.assertEqual(response.status_code, 400)
        self.assertEqual(Comment.objects.count(), 0)

    def test_list_comments_returns_200_with_correct_count(self):
        Comment.objects.create(user=self.student, post=self.post, message='C1')
        Comment.objects.create(user=self.student, post=self.post, message='C2')
        response = self.client.get(f'/documents/comments/{self.post.pk}')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.data), 2)

    def test_list_comments_empty_returns_empty_list(self):
        response = self.client.get(f'/documents/comments/{self.post.pk}')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data, [])

    def test_list_comments_for_nonexistent_post_returns_404(self):
        response = self.client.get('/documents/comments/99999')
        self.assertEqual(response.status_code, 404)

    def test_comment_response_includes_user(self):
        response = self.client.post(
            f'/documents/comments/?post={self.post.pk}&user={self.student.pk}',
            {'message': 'Test'},
            format='json',
        )
        self.assertIn('user', response.data)

    def test_comment_response_includes_created_at(self):
        response = self.client.post(
            f'/documents/comments/?post={self.post.pk}&user={self.student.pk}',
            {'message': 'Test'},
            format='json',
        )
        self.assertIn('created_at', response.data)

    def test_comments_ordered_chronologically(self):
        Comment.objects.create(user=self.student, post=self.post, message='First')
        Comment.objects.create(user=self.student, post=self.post, message='Second')
        response = self.client.get(f'/documents/comments/{self.post.pk}')
        messages = [c['message'] for c in response.data]
        self.assertEqual(messages, ['First', 'Second'])

    def test_create_comment_for_nonexistent_post_returns_404(self):
        response = self.client.post(
            f'/documents/comments/?post=99999&user={self.student.pk}',
            {'message': 'Test'},
            format='json',
        )
        self.assertEqual(response.status_code, 404)