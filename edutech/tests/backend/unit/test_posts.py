from django.test import TestCase
from django.core.exceptions import ValidationError
from documents.models import Post, PDFAttachment, YoutubeVideo, Like, Dislike
from tests.configuration import make_student, make_course, make_pdf_file


class PostModelCleanTest(TestCase):

    def setUp(self):
        self.course  = make_course()
        self.student = make_student()

    def _unsaved_post(self):
        return Post(
            course=self.course, student=self.student,
            title='T', description='D', post_type='PDF',
        )

    def _saved_post(self):
        return Post.objects.create(
            course=self.course, student=self.student,
            title='T', description='D', post_type='PDF',
        )

    def test_clean_passes_on_unsaved_post_with_no_attachment(self):
        post = self._unsaved_post()
        post.clean()

    def test_clean_raises_on_saved_post_with_no_attachment(self):
        post = self._saved_post()
        with self.assertRaises(ValidationError):
            post.clean()

    def test_clean_passes_on_saved_post_with_attachment(self):
        post = self._saved_post()
        PDFAttachment.objects.create(post=post, file=make_pdf_file())
        post.refresh_from_db()
        post.clean()

    def test_clean_raises_for_saved_post_with_only_video(self):
        # NOTE: this is a known bug — clean() checks hasattr(self, 'vid') but the
        # related_name for YoutubeVideo is 'video', not 'vid'.  So the video is
        # never detected and n_contents stays 0 → raises as if there were no content.
        post = self._saved_post()
        YoutubeVideo.objects.create(post=post, vid='https://www.youtube.com/watch?v=abc')
        post.refresh_from_db()
        with self.assertRaises(ValidationError):
            post.clean()

    def test_str_contains_post_type_display_and_title(self):
        post = self._unsaved_post()
        self.assertIn('PDF',  str(post))
        self.assertIn('Documento PDF', str(post))
        self.assertIn('T',             str(post))



class LikeDislikeConstraintTest(TestCase):

    def setUp(self):
        self.student = make_student()
        self.course  = make_course()
        self.post    = Post.objects.create(
            course=self.course, student=self.student,
            title='T', description='D', post_type='PDF',
        )

    def test_duplicate_like_raises_integrity_error(self):
        Like.objects.create(user=self.student, post=self.post)
        with self.assertRaises(IntegrityError):
            Like.objects.create(user=self.student, post=self.post)

    def test_duplicate_dislike_raises_integrity_error(self):
        Dislike.objects.create(user=self.student, post=self.post)
        with self.assertRaises(IntegrityError):
            Dislike.objects.create(user=self.student, post=self.post)
