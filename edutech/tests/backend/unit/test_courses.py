from django.test import TestCase
from django.db import IntegrityError
from users.models import Student
from courses.models import Course, Year, Subscription, University,Degree
from ..config import make_degree, make_student, make_university, make_year, make_course


class YearModelTest(TestCase):

    def test_str_returns_year_as_string(self):
        y = make_year(year='2')
        self.assertEqual(str(y.year), '2' )

    def test_year_with_degree(self):
        u = University(name="ULPGC", location="Las Palmas")
        d = Degree(name="eii", university=u)
        y = Year(year=3, degree = d)
        self.assertEqual(y.degree, d)


    def test_year_field_accepts_integer(self):
        y = make_year(year=2)
        y.refresh_from_db()
        self.assertEqual(y.year, 2)


class CourseModelTest(TestCase):

    def setUp(self):
        self.year = make_year()

    def test_create_course_with_year(self):
        course = Course.objects.create(name='Producción de Software', year=self.year, semester=1)
        self.assertEqual(course.year, self.year)

    def test_unique_together_name_year_enforced(self):
        Course.objects.create(name='Producción de Software', year=self.year, semester=1)
        with self.assertRaises(IntegrityError):
            Course.objects.create(name='Producción de Software', year=self.year, semester=1)

    def test_same_name_different_year_is_allowed(self):
        uni = make_university(name="Otra Universidad", location="Otro sitio")
        degree = make_degree(name="Otro Grado", university=uni)
        year2 = make_year(year=2, degree=degree)
        Course.objects.create(name='Producción de Software', year=self.year, semester=1)
        Course.objects.create(name='Producción de Software', year=year2, semester=1)
        self.assertEqual(Course.objects.filter(name='Producción de Software').count(), 2)

    def test_cascade_delete_year_removes_course(self):
        course = Course.objects.create(name='Producción de Software', year=self.year, semester=1)
        self.year.delete()
        self.assertFalse(Course.objects.filter(pk=course.pk).exists())


class SubscriptionModelTest(TestCase):

    def setUp(self):
        self.student = Student.objects.create(
            first_name='Pepe', last_name='Garcia', email='pepe@test.com'
        )
        self.year = make_year()
        self.course = Course.objects.create(name='Producción de Software', year=self.year, semester=1)

    def test_create_subscription(self):
        sub = Subscription.objects.create(user=self.student, course=self.course)
        self.assertEqual(sub.user, self.student)
        self.assertEqual(sub.course, self.course)

    def test_cascade_delete_student_removes_subscription(self):
        sub = Subscription.objects.create(user=self.student, course=self.course)
        self.student.delete()
        self.assertFalse(Subscription.objects.filter(pk=sub.pk).exists())

    def test_cascade_delete_course_removes_subscription(self):
        sub = Subscription.objects.create(user=self.student, course=self.course)
        self.course.delete()
        self.assertFalse(Subscription.objects.filter(pk=sub.pk).exists())