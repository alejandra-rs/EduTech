from django.test import TestCase
from django.db import IntegrityError
from courses.models import Course, Year, Subscription
from tests.config import make_student, make_year, make_course


class YearModelTest(TestCase):

    def test_str_returns_year_as_string(self):
        y = Year(year=2)
        self.assertEqual(str(y), '2')

    def test_year_field_accepts_integer(self):
        y = Year.objects.create(year=2)
        y.refresh_from_db()
        self.assertEqual(y.year, 2)


class CourseModelTest(TestCase):

    def setUp(self):
        self.year = Year.objects.create(year=3)

    def test_create_course_with_year(self):
        course = Course.objects.create(name='Producción de Software', year=self.year)
        self.assertEqual(course.year, self.year)

    def test_unique_together_name_year_enforced(self):
        Course.objects.create(name='Producción de Software', year=self.year)
        with self.assertRaises(IntegrityError):
            Course.objects.create(name='Producción de Software', year=self.year)

    def test_same_name_different_year_is_allowed(self):
        year2 = Year.objects.create(year=2)
        Course.objects.create(name='Producción de Software', year=self.year)
        Course.objects.create(name='Producción de Software', year=year2)
        self.assertEqual(Course.objects.filter(name='Producción de Software').count(), 2)

    def test_cascade_delete_year_removes_course(self):
        course = Course.objects.create(name='Producción de Software', year=self.year)
        self.year.delete()
        self.assertFalse(Course.objects.filter(pk=course.pk).exists())


class SubscriptionModelTest(TestCase):

    def setUp(self):
        self.student = Student.objects.create(
            first_name='Pepe', last_name='Garcia', email='pepe@test.com', password='1234'
        )
        self.year = Year.objects.create(year=3)
        self.course = Course.objects.create(name='Producción de Software', year=self.year)

    def test_create_subscription(self):
        sub = Subscription.objects.create(user=self.student, assignment=self.course)
        self.assertEqual(sub.user, self.student)
        self.assertEqual(sub.assignment, self.course)

    def test_cascade_delete_student_removes_subscription(self):
        sub = Subscription.objects.create(user=self.student, assignment=self.course)
        self.student.delete()
        self.assertFalse(Subscription.objects.filter(pk=sub.pk).exists())

    def test_cascade_delete_course_removes_subscription(self):
        sub = Subscription.objects.create(user=self.student, assignment=self.course)
        self.course.delete()
        self.assertFalse(Subscription.objects.filter(pk=sub.pk).exists())