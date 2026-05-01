from django.test import override_settings
from rest_framework.test import APITestCase
from documents.models import Post, PDFAttachment, Report, ReportReason, CommentReport, Comment
from ..config import TEST_STORAGES, make_student, make_course, make_pdf_file


@override_settings(STORAGES=TEST_STORAGES)
class ReportViewTest(APITestCase):

    def setUp(self):
        self.student = make_student()
        self.admin = make_student(email='admin@test.com', first_name='Admin', last_name='User', is_admin=True)
        self.course = make_course()
        self.post = Post.objects.create(
            course=self.course, student=self.student,
            title='Material inadecuado', description='D', post_type='PDF',
        )
        PDFAttachment.objects.create(post=self.post, file=make_pdf_file())
        self.reason = ReportReason.objects.create(reason='Contenido ofensivo')

    # --- Report reasons ---

    def test_get_report_reasons_returns_200(self):
        response = self.client.get('/documents/reports/reasons/')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.data), 1)

    # --- Create report (post) ---

    def test_create_report_returns_201(self):
        response = self.client.post('/documents/reports/', {
            'post_id': self.post.pk,
            'user_id': self.student.pk,
            'reason_id': self.reason.pk,
            'description': 'Este contenido no es apropiado',
        }, format='json')
        self.assertEqual(response.status_code, 201)
        self.assertEqual(Report.objects.count(), 1)

    def test_create_report_missing_description_returns_400(self):
        response = self.client.post('/documents/reports/', {
            'post_id': self.post.pk,
            'user_id': self.student.pk,
            'reason_id': self.reason.pk,
            'description': '',
        }, format='json')
        self.assertEqual(response.status_code, 400)
        self.assertEqual(Report.objects.count(), 0)

    def test_create_report_missing_reason_returns_400(self):
        response = self.client.post('/documents/reports/', {
            'post_id': self.post.pk,
            'user_id': self.student.pk,
            'description': 'Sin motivo',
        }, format='json')
        self.assertEqual(response.status_code, 400)

    def test_create_report_for_nonexistent_post_returns_404(self):
        response = self.client.post('/documents/reports/', {
            'post_id': 99999,
            'user_id': self.student.pk,
            'reason_id': self.reason.pk,
            'description': 'Test',
        }, format='json')
        self.assertEqual(response.status_code, 404)

    # --- Get reports (admin) ---

    def test_get_reports_as_admin_returns_200(self):
        Report.objects.create(reason=self.reason, description='Test', user=self.student, post=self.post)
        response = self.client.get(f'/documents/reports/?admin_id={self.admin.pk}')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.data), 1)

    def test_get_reports_without_admin_returns_403(self):
        response = self.client.get('/documents/reports/')
        self.assertEqual(response.status_code, 403)

    def test_get_reports_with_non_admin_returns_403(self):
        response = self.client.get(f'/documents/reports/?admin_id={self.student.pk}')
        self.assertEqual(response.status_code, 403)

    # --- Reject reports ---

    def test_reject_post_reports_as_admin_returns_200(self):
        Report.objects.create(reason=self.reason, description='Test', user=self.student, post=self.post)
        response = self.client.delete(
            f'/documents/reports/post/{self.post.pk}/?admin_id={self.admin.pk}'
        )
        self.assertEqual(response.status_code, 200)
        self.assertEqual(Report.objects.count(), 0)

    def test_reject_post_reports_without_admin_returns_403(self):
        Report.objects.create(reason=self.reason, description='Test', user=self.student, post=self.post)
        response = self.client.delete(f'/documents/reports/post/{self.post.pk}/')
        self.assertEqual(response.status_code, 403)
        self.assertEqual(Report.objects.count(), 1)

    # --- Resolve report (delete post + email) ---

    def test_resolve_report_deletes_post_and_returns_200(self):
        Report.objects.create(reason=self.reason, description='Test', user=self.student, post=self.post)
        response = self.client.post(
            f'/documents/reports/resolve/{self.post.pk}/',
            {'message': 'Contenido eliminado por incumplir normas', 'admin_id': self.admin.pk},
            format='multipart',
        )
        self.assertEqual(response.status_code, 200)
        self.assertFalse(Post.objects.filter(pk=self.post.pk).exists())

    def test_resolve_report_without_message_returns_400(self):
        response = self.client.post(
            f'/documents/reports/resolve/{self.post.pk}/',
            {'message': '', 'admin_id': self.admin.pk},
            format='multipart',
        )
        self.assertEqual(response.status_code, 400)

    def test_resolve_report_sends_email_to_author(self):
        from django.core import mail
        response = self.client.post(
            f'/documents/reports/resolve/{self.post.pk}/',
            {'message': 'Tu publicación fue eliminada', 'admin_id': self.admin.pk},
            format='multipart',
        )
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(mail.outbox), 1)
        self.assertIn(self.student.email, mail.outbox[0].recipients())

    def test_resolve_report_with_image_attaches_to_email(self):
        from django.core import mail
        from django.core.files.uploadedfile import SimpleUploadedFile
        image = SimpleUploadedFile('evidence.jpg', b'\xff\xd8\xff' + b'x' * 100, content_type='image/jpeg')
        response = self.client.post(
            f'/documents/reports/resolve/{self.post.pk}/',
            {'message': 'Con evidencia', 'admin_id': self.admin.pk, 'image': image},
            format='multipart',
        )
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(mail.outbox), 1)
        email_msg = mail.outbox[0]
        self.assertEqual(len(email_msg.attachments), 1)
        self.assertEqual(email_msg.attachments[0][0], 'evidence.jpg')

    def test_resolve_report_without_image_sends_email_without_attachment(self):
        from django.core import mail
        response = self.client.post(
            f'/documents/reports/resolve/{self.post.pk}/',
            {'message': 'Sin imagen', 'admin_id': self.admin.pk},
            format='multipart',
        )
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(mail.outbox[0].attachments), 0)


@override_settings(STORAGES=TEST_STORAGES)
class CommentReportViewTest(APITestCase):

    def setUp(self):
        self.student = make_student()
        self.course = make_course()
        self.post = Post.objects.create(
            course=self.course, student=self.student,
            title='T', description='D', post_type='PDF',
        )
        PDFAttachment.objects.create(post=self.post, file=make_pdf_file())
        self.comment = Comment.objects.create(user=self.student, post=self.post, message='Comentario test')
        self.reason = ReportReason.objects.create(reason='Contenido ofensivo')

    def test_create_comment_report_returns_201(self):
        response = self.client.post('/documents/reports/comments/', {
            'comment_id': self.comment.pk,
            'user_id': self.student.pk,
            'reason_id': self.reason.pk,
            'description': 'Este comentario incumple las normas',
        }, format='json')
        self.assertEqual(response.status_code, 201)
        self.assertEqual(CommentReport.objects.count(), 1)

    def test_create_comment_report_missing_description_returns_400(self):
        response = self.client.post('/documents/reports/comments/', {
            'comment_id': self.comment.pk,
            'user_id': self.student.pk,
            'reason_id': self.reason.pk,
            'description': '',
        }, format='json')
        self.assertEqual(response.status_code, 400)
        self.assertEqual(CommentReport.objects.count(), 0)

    def test_create_comment_report_missing_reason_returns_400(self):
        response = self.client.post('/documents/reports/comments/', {
            'comment_id': self.comment.pk,
            'user_id': self.student.pk,
            'description': 'Sin motivo',
        }, format='json')
        self.assertEqual(response.status_code, 400)

    def test_create_comment_report_for_nonexistent_comment_returns_404(self):
        response = self.client.post('/documents/reports/comments/', {
            'comment_id': 99999,
            'user_id': self.student.pk,
            'reason_id': self.reason.pk,
            'description': 'Test',
        }, format='json')
        self.assertEqual(response.status_code, 404)

    def test_comment_report_response_includes_reason_and_user(self):
        response = self.client.post('/documents/reports/comments/', {
            'comment_id': self.comment.pk,
            'user_id': self.student.pk,
            'reason_id': self.reason.pk,
            'description': 'Incumple normas',
        }, format='json')
        self.assertEqual(response.status_code, 201)
        self.assertIn('reason', response.data)
        self.assertIn('user', response.data)
        self.assertIn('created_at', response.data)
