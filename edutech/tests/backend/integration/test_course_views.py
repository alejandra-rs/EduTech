from django.test import TestCase
from rest_framework.test import APITestCase
from courses.models import Course, Year, University, Degree
from ..config import make_student, make_year, make_course, make_degree


class YearListCreateViewTest(APITestCase):

    def test_list_years_returns_200_and_year_list(self):
        u = University.objects.create(name="ULPGC", location="Las Palmas")
        d = Degree.objects.create(name="EII", university=u)
        Year.objects.create(year=2, degree=d)
        Year.objects.create(year=3, degree=d)
        response = self.client.get('/courses/years/')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.data), 2)

    def test_list_years_empty_returns_empty_list(self):
        response = self.client.get('/courses/years/')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data, [])

    def test_create_year_returns_201(self):
        data = {
            'year': 2,
            'degree': make_degree().id
        }
        response = self.client.post('/courses/years/', data, format='json')
        self.assertEqual(response.status_code, 201)
    def test_create_empty_year_returns_400(self):
        response = self.client.post('/courses/years/', {}, format='json')
        self.assertEqual(response.status_code, 400)


class CourseListCreateViewTest(APITestCase):

    def setUp(self):
        self.year = make_year()

    def test_list_courses_returns_nested_year(self):
        Course.objects.create(name='Producción de Software', year=self.year, semester=1)
        response = self.client.get('/courses/')
        self.assertEqual(response.status_code, 200)
        self.assertIn('year', response.data[0])
        self.assertIn('id', response.data[0]['year'])
        self.assertIn('year', response.data[0]['year'])

    def test_create_course_returns_201(self):
        response = self.client.post(
            '/courses/',
            {'name': 'Producción de Software', 'year_id': self.year.pk, 'semester': 1},
            format='json'
        )
        self.assertEqual(response.status_code, 201)
        self.assertEqual(Course.objects.count(), 1)

    def test_create_duplicate_course_raises_400(self):
        Course.objects.create(name='Producción de Software', year=self.year, semester=1)
        response = self.client.post(
            '/courses/',
            {'name': 'Producción de Software', 'year_id': self.year.pk, 'semester': 1},
            format='json'
        )
        self.assertEqual(response.status_code, 400)

    def test_create_course_missing_year_id_returns_400(self):
        response = self.client.post('/courses/', {'name': 'Physics'}, format='json')
        self.assertEqual(response.status_code, 400)
