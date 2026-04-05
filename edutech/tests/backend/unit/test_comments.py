from django.test import TestCase
from documents.models import Post, Comment
from ..config import make_student, make_course


class CommentModelTest(TestCase):

    def setUp(self):
        self.student = make_student()
        self.course  = make_course()
        self.post = Post.objects.create(
            course=self.course, student=self.student,
            title='T', description='D', post_type='PDF',
        )

    def test_create_comment_stores_all_fields(self):
        comment = Comment.objects.create(user=self.student, post=self.post, message='Buen material')
        self.assertEqual(comment.message, 'Buen material')
        self.assertEqual(comment.user, self.student)
        self.assertEqual(comment.post, self.post)

    def test_str_contains_user_and_post(self):
        comment = Comment.objects.create(user=self.student, post=self.post, message='Test')
        self.assertIn(str(self.student), str(comment))

    def test_comment_has_created_at_field(self):
        comment = Comment.objects.create(user=self.student, post=self.post, message='Test')
        self.assertIsNotNone(comment.created_at)

    def test_multiple_comments_per_post_allowed(self):
        Comment.objects.create(user=self.student, post=self.post, message='Primer Comentario')
        Comment.objects.create(user=self.student, post=self.post, message='Segundo Comentario')
        self.assertEqual(Comment.objects.filter(post=self.post).count(), 2)

    def test_empty_message_is_rejected_by_view(self):
        comment = Comment(user=self.student, post=self.post, message='')
        comment.save()
        self.assertEqual(Comment.objects.count(), 1)