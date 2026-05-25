from django.test import override_settings
from rest_framework.test import APITestCase
from documents.models import Post, PDFAttachment, PDFRevisionNote
from ..config import TEST_STORAGES, make_student, make_course, make_pdf_file, login_student


def _make_revision_note(student, course):
    post = Post.objects.create(
        course=course, student=student,
        title='Draft for review', description='D', post_type='PDF', is_draft=True,
    )
    attachment = PDFAttachment.objects.create(
        post=post,
        file=make_pdf_file(),
        processing_status=PDFAttachment.ProcessingStages.REVISION,
    )
    return PDFRevisionNote.objects.create(attachment=attachment, reason='Needs review')


@override_settings(STORAGES=TEST_STORAGES)
class RevisionListViewTest(APITestCase):

    def setUp(self):
        self.student = make_student()
        login_student(self.client, self.student)
        self.admin = make_student(email='admin@test.com', is_admin=True)
        self.course = make_course()

    def test_get_as_admin_returns_200(self):
        response = self.client.get('/documents/revision/', {'admin_id': self.admin.pk})
        self.assertEqual(response.status_code, 200)

    def test_get_without_admin_id_returns_403(self):
        response = self.client.get('/documents/revision/')
        self.assertEqual(response.status_code, 403)

    def test_get_with_non_admin_student_returns_403(self):
        response = self.client.get('/documents/revision/', {'admin_id': self.student.pk})
        self.assertEqual(response.status_code, 403)

    def test_get_returns_list_of_pending_notes(self):
        _make_revision_note(self.student, self.course)
        response = self.client.get('/documents/revision/', {'admin_id': self.admin.pk})
        self.assertEqual(len(response.data), 1)

    def test_get_returns_empty_when_no_notes(self):
        response = self.client.get('/documents/revision/', {'admin_id': self.admin.pk})
        self.assertEqual(response.data, [])


@override_settings(STORAGES=TEST_STORAGES)
class RevisionPublishViewTest(APITestCase):

    def setUp(self):
        self.student = make_student()
        login_student(self.client, self.student)
        self.admin = make_student(email='admin@test.com', is_admin=True)
        self.course = make_course()

    def test_publish_as_admin_returns_200(self):
        note = _make_revision_note(self.student, self.course)
        response = self.client.post(
            f'/documents/revision/publish/{note.pk}/',
            {'admin_id': self.admin.pk},
            format='json',
        )
        self.assertEqual(response.status_code, 200)

    def test_publish_marks_post_as_not_draft(self):
        note = _make_revision_note(self.student, self.course)
        self.client.post(
            f'/documents/revision/publish/{note.pk}/',
            {'admin_id': self.admin.pk},
            format='json',
        )
        note.attachment.post.refresh_from_db()
        self.assertFalse(note.attachment.post.is_draft)

    def test_publish_sets_attachment_status_to_completed(self):
        note = _make_revision_note(self.student, self.course)
        self.client.post(
            f'/documents/revision/publish/{note.pk}/',
            {'admin_id': self.admin.pk},
            format='json',
        )
        note.attachment.refresh_from_db()
        self.assertEqual(note.attachment.processing_status, PDFAttachment.ProcessingStages.COMPLETED)

    def test_publish_deletes_revision_note(self):
        note = _make_revision_note(self.student, self.course)
        pk = note.pk
        self.client.post(
            f'/documents/revision/publish/{note.pk}/',
            {'admin_id': self.admin.pk},
            format='json',
        )
        self.assertFalse(PDFRevisionNote.objects.filter(pk=pk).exists())

    def test_publish_without_admin_returns_403(self):
        note = _make_revision_note(self.student, self.course)
        response = self.client.post(f'/documents/revision/publish/{note.pk}/', {}, format='json')
        self.assertEqual(response.status_code, 403)

    def test_publish_nonexistent_note_returns_404(self):
        response = self.client.post(
            '/documents/revision/publish/99999/',
            {'admin_id': self.admin.pk},
            format='json',
        )
        self.assertEqual(response.status_code, 404)


@override_settings(STORAGES=TEST_STORAGES)
class RevisionDeleteViewTest(APITestCase):

    def setUp(self):
        self.student = make_student()
        login_student(self.client, self.student)
        self.admin = make_student(email='admin@test.com', is_admin=True)
        self.course = make_course()

    def test_delete_as_admin_returns_200(self):
        note = _make_revision_note(self.student, self.course)
        response = self.client.delete(f'/documents/revision/{note.pk}/?admin_id={self.admin.pk}')
        self.assertEqual(response.status_code, 200)

    def test_delete_removes_post_from_db(self):
        note = _make_revision_note(self.student, self.course)
        post_pk = note.attachment.post.pk
        self.client.delete(f'/documents/revision/{note.pk}/?admin_id={self.admin.pk}')
        self.assertFalse(Post.objects.filter(pk=post_pk).exists())

    def test_delete_removes_revision_note_from_db(self):
        note = _make_revision_note(self.student, self.course)
        pk = note.pk
        self.client.delete(f'/documents/revision/{note.pk}/?admin_id={self.admin.pk}')
        self.assertFalse(PDFRevisionNote.objects.filter(pk=pk).exists())

    def test_delete_without_admin_returns_403(self):
        note = _make_revision_note(self.student, self.course)
        response = self.client.delete(f'/documents/revision/{note.pk}/')
        self.assertEqual(response.status_code, 403)

    def test_delete_nonexistent_note_returns_404(self):
        response = self.client.delete(f'/documents/revision/99999/?admin_id={self.admin.pk}')
        self.assertEqual(response.status_code, 404)
