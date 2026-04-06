from django.test import override_settings
from django.core.files.uploadedfile import SimpleUploadedFile
from unittest.mock import patch
from rest_framework.test import APITestCase
from documents.models import Post, PDFAttachment, YoutubeVideo, MAX_PDF_KB
from ..config import TEST_STORAGES, make_student, make_course, make_pdf_file, mock_urlopen


@override_settings(STORAGES=TEST_STORAGES)
class PDFUploadViewTest(APITestCase):

    def setUp(self):
        self.student = make_student()
        self.course  = make_course()

    def _post(self, file=None, **overrides):
        payload = {
            'title': 'My Doc',
            'description': 'A description',
            'course': self.course.pk,
            'student': self.student.pk,
            'file': file or make_pdf_file(),
        }
        payload.update(overrides)
        return self.client.post('/documents/upload/pdf/', payload, format='multipart')

    def test_upload_valid_pdf_returns_201(self):
        response = self._post()
        self.assertEqual(response.status_code, 201)
        self.assertEqual(Post.objects.count(), 1)
        self.assertEqual(PDFAttachment.objects.count(), 1)
        self.assertEqual(response.data['post_type'], 'PDF')

    def test_upload_returns_full_post_serializer_shape(self):
        response = self._post()
        for key in ('id', 'title', 'description', 'post_type',
                    'course', 'student', 'created_at', 'pdf', 'vid'):
            self.assertIn(key, response.data)

    def test_upload_non_pdf_returns_400(self):
        bad = SimpleUploadedFile('doc.docx', b'data', content_type='application/octet-stream')
        response = self._post(file=bad)
        self.assertEqual(response.status_code, 400)

    def test_upload_oversized_pdf_returns_400(self):
        big = make_pdf_file(size_bytes=(MAX_PDF_KB + 1) * 1024)
        response = self._post(file=big)
        self.assertEqual(response.status_code, 400)

    def test_upload_missing_course_returns_400(self):
        payload = {
            'title': 'T', 'description': 'D',
            'student': self.student.pk,
            'file': make_pdf_file(),
        }
        response = self.client.post('/documents/upload/pdf/', payload, format='multipart')
        self.assertEqual(response.status_code, 400)

    def test_no_post_created_on_validation_failure(self):
        bad = SimpleUploadedFile('doc.txt', b'data', content_type='text/plain')
        self._post(file=bad)
        self.assertEqual(Post.objects.count(), 0)


class VideoUploadViewTest(APITestCase):

    def setUp(self):
        self.student = make_student()
        self.course  = make_course()

    def _post(self, vid='https://www.youtube.com/watch?v=dQw4w9WgXcQ', **overrides):
        data = {
            'title': 'My Video',
            'description': 'Desc',
            'course': self.course.pk,
            'student': self.student.pk,
            'vid': vid,
        }
        data.update(overrides)
        return self.client.post('/documents/upload/video/', data, format='json')

    @patch('documents.serializers.urllib.request.urlopen', return_value=mock_urlopen())
    def test_upload_valid_video_returns_201(self, _):
        response = self._post()
        self.assertEqual(response.status_code, 201)
        self.assertEqual(Post.objects.count(), 1)
        self.assertEqual(YoutubeVideo.objects.count(), 1)
        self.assertEqual(response.data['post_type'], 'VID')

    @patch('documents.serializers.urllib.request.urlopen', side_effect=Exception('bad'))
    def test_upload_invalid_youtube_url_returns_400(self, _):
        response = self._post()
        self.assertEqual(response.status_code, 400)
        self.assertIn('vid', response.data)

    @patch('documents.serializers.urllib.request.urlopen')
    def test_upload_malformed_url_returns_400(self, mock_open):
        response = self._post(vid='not-a-url')
        self.assertEqual(response.status_code, 400)
        mock_open.assert_not_called()

    @patch('documents.serializers.urllib.request.urlopen', side_effect=Exception('bad'))
    def test_no_post_created_on_invalid_video(self, _):
        self._post()
        self.assertEqual(Post.objects.count(), 0)

    @patch('documents.serializers.urllib.request.urlopen', return_value=mock_urlopen())
    def test_video_url_stored_correctly(self, _):
        url = 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'
        self._post(vid=url)
        video = YoutubeVideo.objects.first()
        self.assertEqual(video.vid, url)
