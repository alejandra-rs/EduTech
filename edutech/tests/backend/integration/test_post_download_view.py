from django.test import override_settings
from unittest.mock import patch, MagicMock
from rest_framework.test import APITestCase
from documents.models import Post, PDFAttachment, YoutubeVideo
from ..config import TEST_STORAGES, make_student, make_course, make_pdf_file


@override_settings(STORAGES=TEST_STORAGES)
class PDFDownloadViewTest(APITestCase):

    FAKE_URL = 'https://r2.example.com/documents/test.pdf?X-Amz-Signature=abc'

    def _mock_s3(self, mock_boto3):
        mock_client = MagicMock()
        mock_boto3.return_value = mock_client
        mock_client.generate_presigned_url.return_value = self.FAKE_URL
        return mock_client

    def setUp(self):
        self.student = make_student()
        self.course  = make_course()

    def _create_pdf_post(self):
        post = Post.objects.create(
            course=self.course, student=self.student,
            title='Report', description='D', post_type='PDF',
        )
        PDFAttachment.objects.create(post=post, file=make_pdf_file())
        return post

    @patch('documents.views.boto3.client')
    def test_returns_302_redirect_to_url(self, mock_boto3):
        self._mock_s3(mock_boto3)
        post = self._create_pdf_post()
        response = self.client.get(f'/documents/download/pdf/{post.pk}')
        self.assertEqual(response.status_code, 302)
        self.assertEqual(response['Location'], self.FAKE_URL)

    @patch('documents.views.boto3.client')
    def test_boto3_client_called_with_s3_and_credentials(self, mock_boto3):
        self._mock_s3(mock_boto3)
        post = self._create_pdf_post()
        self.client.get(f'/documents/download/pdf/{post.pk}')

        args, kwargs = mock_boto3.call_args
        self.assertEqual(args[0], 's3')
        for kwarg in ('endpoint_url', 'aws_access_key_id',
                      'aws_secret_access_key', 'region_name'):
            self.assertIn(kwarg, kwargs)

    @patch('documents.views.boto3.client')
    def test_generate_url_called_with_correct_params(self, mock_boto3):
        mock_s3 = self._mock_s3(mock_boto3)
        post = self._create_pdf_post()
        self.client.get(f'/documents/download/pdf/{post.pk}')
        _, kwargs = mock_s3.generate_presigned_url.call_args
        params = kwargs['Params']
        self.assertIn('Bucket', params)
        self.assertIn('Key', params)
        self.assertIn('ResponseContentDisposition', params)
        self.assertIn('attachment', params['ResponseContentDisposition'])

    @patch('documents.views.boto3.client')
    def test_download_nonexistent_post_returns_404(self, mock_boto3):
        self._mock_s3(mock_boto3)
        response = self.client.get('/documents/download/pdf/99999')
        self.assertEqual(response.status_code, 404)

    @patch('documents.views.boto3.client')
    def test_download_video_post_returns_404(self, mock_boto3):
        self._mock_s3(mock_boto3)
        post = Post.objects.create(
            course=self.course, student=self.student,
            title='Video', description='D', post_type='VID',
        )
        YoutubeVideo.objects.create(post=post, vid='https://www.youtube.com/watch?v=x')
        response = self.client.get(f'/documents/download/pdf/{post.pk}')
        self.assertEqual(response.status_code, 404)
