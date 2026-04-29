from django.test import TestCase, override_settings
from django.core import mail
from django.db.models.signals import post_save
from documents.models import Post, PDFAttachment
from courses.models import Subscription
from documents.notifications import notify_subscribers_of_new_post
from documents.signals import post_created
from ..config import TEST_STORAGES, make_student, make_course, make_pdf_file


@override_settings(
    STORAGES=TEST_STORAGES,
    EMAIL_BACKEND='django.core.mail.backends.locmem.EmailBackend',
)
class NotificationTest(TestCase):

    def setUp(self):
        self.course = make_course()
        self.uploader = make_student(first_name='Maria', last_name='Lopez', email='maria@test.com')
        self.subscriber = make_student(first_name='Pepe', last_name='Garcia', email='pepe@test.com')
        post_save.disconnect(post_created, sender=Post)

    def tearDown(self):
        post_save.connect(post_created, sender=Post)

    def _make_post(self, title='Scrum Guide'):
        post = Post.objects.create(
            course=self.course, student=self.uploader,
            title=title, description='Guía de Scrum', post_type='PDF',
        )
        PDFAttachment.objects.create(post=post, file=make_pdf_file())
        return post

    def test_email_sent_to_subscriber(self):
        Subscription.objects.create(user=self.subscriber, course=self.course)
        post = self._make_post()
        notify_subscribers_of_new_post(post)
        self.assertEqual(len(mail.outbox), 1)
        self.assertIn(self.subscriber.email, mail.outbox[0].to)

    def test_no_email_when_no_subscribers(self):
        post = self._make_post()
        notify_subscribers_of_new_post(post)
        self.assertEqual(len(mail.outbox), 0)

    def test_non_subscriber_does_not_receive_email(self):
        Subscription.objects.create(user=self.subscriber, course=self.course)
        non_sub = make_student(first_name='Carlos', last_name='Ruiz', email='carlos@test.com')
        post = self._make_post()
        notify_subscribers_of_new_post(post)
        recipients = [addr for m in mail.outbox for addr in m.to]
        self.assertIn(self.subscriber.email, recipients)
        self.assertNotIn(non_sub.email, recipients)

    def test_email_subject_contains_course_name(self):
        Subscription.objects.create(user=self.subscriber, course=self.course)
        post = self._make_post()
        notify_subscribers_of_new_post(post)
        self.assertIn(self.course.name, mail.outbox[0].subject)

    def test_email_body_contains_post_title(self):
        Subscription.objects.create(user=self.subscriber, course=self.course)
        post = self._make_post()
        notify_subscribers_of_new_post(post)
        self.assertIn(post.title, mail.outbox[0].body)

    def test_multiple_subscribers_each_receive_email(self):
        other = make_student(first_name='Ana', last_name='Lopez', email='ana@test.com')
        Subscription.objects.create(user=self.subscriber, course=self.course)
        Subscription.objects.create(user=other, course=self.course)
        post = self._make_post()
        notify_subscribers_of_new_post(post)
        self.assertEqual(len(mail.outbox), 2)


@override_settings(
    STORAGES=TEST_STORAGES,
    EMAIL_BACKEND='django.core.mail.backends.locmem.EmailBackend',
)
class NotificationSignalTest(TestCase):

    def setUp(self):
        self.course = make_course()
        self.uploader = make_student(first_name='Maria', last_name='Lopez', email='maria@test.com')
        self.subscriber = make_student(first_name='Pepe', last_name='Garcia', email='pepe@test.com')

    def _make_post(self):
        post = Post.objects.create(
            course=self.course, student=self.uploader,
            title='Scrum Guide', description='D', post_type='PDF',
        )
        PDFAttachment.objects.create(post=post, file=make_pdf_file())
        return post

    def test_signal_sends_email_on_post_creation(self):
        Subscription.objects.create(user=self.subscriber, course=self.course)
        self._make_post()
        self.assertEqual(len(mail.outbox), 1)
        self.assertIn(self.subscriber.email, mail.outbox[0].to)

    def test_no_email_sent_when_no_subscribers(self):
        self._make_post()
        self.assertEqual(len(mail.outbox), 0)