from django.test import override_settings
from rest_framework.test import APITestCase
from documents.models import Post, PDFAttachment, Like, Dislike
from ..config import TEST_STORAGES, make_student, make_course, make_pdf_file


@override_settings(STORAGES=TEST_STORAGES)
class LikeViewTest(APITestCase):

    def setUp(self):
        self.student = make_student()
        self.course  = make_course()
        self.post = Post.objects.create(
            course=self.course, student=self.student,
            title='T', description='D', post_type='PDF',
        )
        PDFAttachment.objects.create(post=self.post, file=make_pdf_file())

    def test_create_like_returns_201(self):
        response = self.client.post('/documents/likes/', {
            'user': self.student.pk, 'post': self.post.pk,
        }, format='json')
        self.assertEqual(response.status_code, 201)
        self.assertIn('id', response.data)
        self.assertEqual(response.data['count'], 1)

    def test_create_duplicate_like_returns_200_no_duplicate(self):
        Like.objects.create(user=self.student, post=self.post)
        response = self.client.post('/documents/likes/', {
            'user': self.student.pk, 'post': self.post.pk,
        }, format='json')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(Like.objects.count(), 1)

    def test_delete_like_returns_200(self):
        like = Like.objects.create(user=self.student, post=self.post)
        response = self.client.delete(f'/documents/likes/{like.pk}')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(Like.objects.count(), 0)

    def test_delete_nonexistent_like_returns_404(self):
        response = self.client.delete('/documents/likes/99999')
        self.assertEqual(response.status_code, 404)

    def test_get_like_exists_returns_id(self):
        like = Like.objects.create(user=self.student, post=self.post)
        response = self.client.get(f'/documents/likes/?user={self.student.pk}&post={self.post.pk}')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data['id'], like.pk)
        self.assertEqual(response.data['count'], 1)

    def test_get_like_not_exists_returns_negative_id(self):
        response = self.client.get(f'/documents/likes/?user={self.student.pk}&post={self.post.pk}')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data, {'id': -1, 'count': 0})

    def test_create_like_when_dislike_exists_returns_400(self):
        Dislike.objects.create(user=self.student, post=self.post)
        response = self.client.post('/documents/likes/', {
            'user': self.student.pk, 'post': self.post.pk,
        }, format='json')
        self.assertEqual(response.status_code, 400)
        self.assertEqual(Like.objects.count(), 0)

    def test_create_like_for_nonexistent_post_returns_404(self):
        response = self.client.post('/documents/likes/', {
            'user': self.student.pk, 'post': 99999,
        }, format='json')
        self.assertEqual(response.status_code, 404)


@override_settings(STORAGES=TEST_STORAGES)
class DislikeViewTest(APITestCase):

    def setUp(self):
        self.student = make_student()
        self.course  = make_course()
        self.post = Post.objects.create(
            course=self.course, student=self.student,
            title='T', description='D', post_type='PDF',
        )
        PDFAttachment.objects.create(post=self.post, file=make_pdf_file())

    def test_create_dislike_returns_201(self):
        response = self.client.post('/documents/dislikes/', {
            'user': self.student.pk, 'post': self.post.pk,
        }, format='json')
        self.assertEqual(response.status_code, 201)
        self.assertIn('id', response.data)
        self.assertEqual(response.data['count'], 1)

    def test_create_duplicate_dislike_returns_200_no_duplicate(self):
        Dislike.objects.create(user=self.student, post=self.post)
        response = self.client.post('/documents/dislikes/', {
            'user': self.student.pk, 'post': self.post.pk,
        }, format='json')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(Dislike.objects.count(), 1)

    def test_delete_dislike_returns_200(self):
        dislike = Dislike.objects.create(user=self.student, post=self.post)
        response = self.client.delete(f'/documents/dislikes/{dislike.pk}')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(Dislike.objects.count(), 0)

    def test_delete_nonexistent_dislike_returns_404(self):
        response = self.client.delete('/documents/dislikes/99999')
        self.assertEqual(response.status_code, 404)

    def test_get_dislike_exists_returns_id(self):
        dislike = Dislike.objects.create(user=self.student, post=self.post)
        response = self.client.get(f'/documents/dislikes/?user={self.student.pk}&post={self.post.pk}')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data['id'], dislike.pk)
        self.assertEqual(response.data['count'], 1)

    def test_get_dislike_not_exists_returns_negative_id(self):
        response = self.client.get(f'/documents/dislikes/?user={self.student.pk}&post={self.post.pk}')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data, {"id": -1, "count": 0})

    def test_create_dislike_when_like_exists_returns_400(self):
        Like.objects.create(user=self.student, post=self.post)
        response = self.client.post('/documents/dislikes/', {
            'user': self.student.pk, 'post': self.post.pk,
        }, format='json')
        self.assertEqual(response.status_code, 400)
        self.assertEqual(Dislike.objects.count(), 0)

    def test_create_dislike_for_nonexistent_post_returns_404(self):
        response = self.client.post('/documents/dislikes/', {
            'user': self.student.pk, 'post': 99999,
        }, format='json')
        self.assertEqual(response.status_code, 404)