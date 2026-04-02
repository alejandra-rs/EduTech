from django.test import TestCase
from users.models import Student
from tests.config import make_student

class StudentModelTest(TestCase):

    def setUp(self):
        self.student = Student.objects.create(
            first_name='Pepe',
            last_name='Garcia',
            email='pepe@test.com',
            password='secret123',
        )

    def test_create_student_stores_all_fields(self):
        s = Student.objects.get(pk=self.student.pk)
        self.assertEqual(s.first_name, 'Pepe')
        self.assertEqual(s.last_name, 'Garcia')
        self.assertEqual(s.email, 'pepe@test.com')
        self.assertEqual(s.password, 'secret123')

    def test_str_returns_full_name(self):
        self.assertEqual(str(self.student), 'Pepe Garcia')

    def test_default_ordering_surname_then_name(self):
        Student.objects.all().delete()
        Student.objects.create(first_name='Andres', last_name='Perez',   email='a@test.com', password='123')
        Student.objects.create(first_name='Ana',  last_name='Martinez', email='a@test.com', password='456')
        Student.objects.create(first_name='Luis', last_name='Perez',   email='l@test.com', password='789')
        students = list(Student.objects.all())
        self.assertEqual(students[0].last_name,  'Martinez')
        self.assertEqual(students[1].first_name, 'Luis')
        self.assertEqual(students[2].first_name, 'Zara')

    def test_email_field_accepts_valid_email(self):
        self.student.full_clean()

    def test_duplicate_emails_allowed(self):
        Student.objects.create(
            first_name='Pedro', last_name='Gomez',
            email='pepe@test.com', password='x',
        )
        self.assertEqual(Student.objects.filter(email='pepe@test.com').count(), 2)
