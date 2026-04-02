from django.test import override_settings
from rest_framework.test import APITestCase
from documents.models import Post, PDFAttachment, YoutubeVideo
from ..config import TEST_STORAGES, make_student, make_course, make_pdf_file


@override_settings(STORAGES=TEST_STORAGES)
class PostListViewTest(APITestCase):

    def setUp(self):
        self.student = make_student()
        self.course  = make_course()

    def _make_pdf_post(self, title='PDF Post'):
        post = Post.objects.create(
            course=self.course, student=self.student,
            title=title, description='D', post_type='PDF',
        )
        PDFAttachment.objects.create(post=post, file=make_pdf_file())
        return post

    def _make_video_post(self, title='Video Post'):
        post = Post.objects.create(
            course=self.course, student=self.student,
            title=title, description='D', post_type='VID',
        )
        YoutubeVideo.objects.create(post=post, vid='https://www.youtube.com/watch?v=abc')
        return post

    def test_empty_list_returns_200(self):
        response = self.client.get('/documents/')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data['results'] if 'results' in response.data else response.data, [])

    def test_returns_all_posts(self):
        self._make_pdf_post()
        self._make_video_post()
        response = self.client.get('/documents/')
        self.assertEqual(response.status_code, 200)
        data = response.data
        self.assertEqual(len(data), 2)

    def test_filter_by_post_type_pdf(self):
        self._make_pdf_post()
        self._make_video_post()
        response = self.client.get('/documents/?post_type=PDF')
        data = response.data
        self.assertEqual(len(data), 1)
        self.assertEqual(data[0]['post_type'], 'PDF')

    def test_filter_by_post_type_vid(self):
        self._make_pdf_post()
        self._make_video_post()
        response = self.client.get('/documents/?post_type=VID')
        data = response.data
        self.assertEqual(len(data), 1)
        self.assertEqual(data[0]['post_type'], 'VID')

    def test_filter_by_multiple_post_types_returns_all(self):
        self._make_pdf_post()
        self._make_video_post()
        response = self.client.get('/documents/?post_type=PDF&post_type=VID')
        data = response.data
        self.assertEqual(len(data), 2)

    def test_search_title_case_insensitive(self):
        self._make_pdf_post(title='Django Basics')
        self._make_pdf_post(title='Flask Intro')
        response = self.client.get('/documents/?search_title=django')
        data = response.data
        self.assertEqual(len(data), 1)
        self.assertEqual(data[0]['title'], 'Django Basics')

    def test_search_title_no_match_returns_empty(self):
        self._make_pdf_post(title='Django Basics')
        response = self.client.get('/documents/?search_title=nomatch')
        data = response.data
        self.assertEqual(len(data), 0)

    def test_response_contains_nested_pdf_key(self):
        self._make_pdf_post()
        response = self.client.get('/documents/')
        data = response.data
        self.assertIsNotNone(data[0]['pdf'])
        self.assertIn('id',   data[0]['pdf'])
        self.assertIn('file', data[0]['pdf'])

    def test_response_contains_nested_video_key(self):
        self._make_video_post()
        response = self.client.get('/documents/')
        data = response.data
        self.assertIsNotNone(data[0]['vid'])
        self.assertIn('vid', data[0]['vid'])