from django.test import TestCase
from documents.models import Post, Report, ReportReason, CommentReport, Comment
from ..config import make_student, make_course


class ReportModelTest(TestCase):

    def setUp(self):
        self.student = make_student()
        self.course = make_course()
        self.post = Post.objects.create(
            course=self.course, student=self.student,
            title='T', description='D', post_type='PDF',
        )
        self.reason = ReportReason.objects.create(reason='Contenido ofensivo')

    def test_create_report_stores_all_fields(self):
        report = Report.objects.create(
            reason=self.reason, description='Descripción del reporte',
            user=self.student, post=self.post,
        )
        self.assertEqual(report.description, 'Descripción del reporte')
        self.assertEqual(report.user, self.student)
        self.assertEqual(report.post, self.post)
        self.assertEqual(report.reason, self.reason)

    def test_report_has_created_at(self):
        report = Report.objects.create(
            reason=self.reason, description='Test',
            user=self.student, post=self.post,
        )
        self.assertIsNotNone(report.created_at)

    def test_multiple_reports_per_post_allowed(self):
        other_student = make_student(email='other@test.com', first_name='Ana', last_name='Lopez')
        Report.objects.create(reason=self.reason, description='R1', user=self.student, post=self.post)
        Report.objects.create(reason=self.reason, description='R2', user=other_student, post=self.post)
        self.assertEqual(Report.objects.filter(post=self.post).count(), 2)

    def test_report_reason_str(self):
        self.assertEqual(str(self.reason), 'Contenido ofensivo')

    def test_deleting_post_cascades_to_reports(self):
        Report.objects.create(reason=self.reason, description='Test', user=self.student, post=self.post)
        self.post.delete()
        self.assertEqual(Report.objects.count(), 0)


class CommentReportModelTest(TestCase):

    def setUp(self):
        self.student = make_student()
        self.course = make_course()
        self.post = Post.objects.create(
            course=self.course, student=self.student,
            title='T', description='D', post_type='PDF',
        )
        self.comment = Comment.objects.create(user=self.student, post=self.post, message='Un comentario')
        self.reason = ReportReason.objects.create(reason='Contenido ofensivo')

    def test_create_comment_report_stores_all_fields(self):
        report = CommentReport.objects.create(
            reason=self.reason, description='Incumple las normas',
            user=self.student, comment=self.comment,
        )
        self.assertEqual(report.description, 'Incumple las normas')
        self.assertEqual(report.user, self.student)
        self.assertEqual(report.comment, self.comment)
        self.assertEqual(report.reason, self.reason)

    def test_comment_report_has_created_at(self):
        report = CommentReport.objects.create(
            reason=self.reason, description='Test',
            user=self.student, comment=self.comment,
        )
        self.assertIsNotNone(report.created_at)

    def test_deleting_comment_cascades_to_comment_reports(self):
        CommentReport.objects.create(
            reason=self.reason, description='Test',
            user=self.student, comment=self.comment,
        )
        self.comment.delete()
        self.assertEqual(CommentReport.objects.count(), 0)

    def test_multiple_reports_per_comment_allowed(self):
        other_student = make_student(email='other@test.com', first_name='Ana', last_name='Lopez')
        CommentReport.objects.create(reason=self.reason, description='R1', user=self.student, comment=self.comment)
        CommentReport.objects.create(reason=self.reason, description='R2', user=other_student, comment=self.comment)
        self.assertEqual(CommentReport.objects.filter(comment=self.comment).count(), 2)
