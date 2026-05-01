from django.test import TestCase
from django.db import IntegrityError, transaction
from users.models import Student
from ..config import make_student

class StudentModelTest(TestCase):

    def setUp(self):
        self.student = Student.objects.create(
            first_name='Pepe',
            last_name='Garcia',
            email='pepe@test.com',
        )

    def test_create_student_stores_all_fields(self):
        s = Student.objects.get(pk=self.student.pk)
        self.assertEqual(s.first_name, 'Pepe')
        self.assertEqual(s.last_name, 'Garcia')
        self.assertEqual(s.email, 'pepe@test.com')

    def test_str_returns_full_name(self):
        self.assertEqual(str(self.student), 'Pepe Garcia')


    def test_email_field_accepts_valid_email(self):
        self.student.full_clean()

    def test_duplicate_emails_not_allowed(self):
        with self.assertRaises(IntegrityError):
            with transaction.atomic(): 
                Student.objects.create(
                    first_name='Pedro', last_name='Gomez',
                    email='pepe@test.com'
                )
        self.assertEqual(Student.objects.filter(email='pepe@test.com').count(), 1)