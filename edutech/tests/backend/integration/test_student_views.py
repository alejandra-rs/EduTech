from rest_framework.test import APITestCase
from django.contrib.auth.models import User
from users.models import Student
from ..config import make_student, make_degree, login_student


class StudentMeViewTest(APITestCase):

    def setUp(self):
        self.student = make_student()
        login_student(self.client, self.student)

    def test_get_returns_200(self):
        response = self.client.get('/students/me/')
        self.assertEqual(response.status_code, 200)

    def test_get_returns_own_student_data(self):
        response = self.client.get('/students/me/')
        self.assertEqual(response.data['email'], self.student.email)
        self.assertEqual(response.data['first_name'], self.student.first_name)
        self.assertEqual(response.data['last_name'], self.student.last_name)

    def test_get_without_matching_student_returns_404(self):
        orphan = User.objects.create(username='orphan@test.com', email='orphan@test.com')
        self.client.force_authenticate(user=orphan)
        response = self.client.get('/students/me/')
        self.assertEqual(response.status_code, 404)

    def test_patch_updates_degree(self):
        degree = make_degree()
        response = self.client.patch('/students/me/', {'degree': [degree.pk]}, format='json')
        self.assertEqual(response.status_code, 200)
        self.student.refresh_from_db()
        self.assertIn(degree, self.student.degree.all())

    def test_patch_clears_degrees_when_empty_list(self):
        degree = make_degree()
        self.student.degree.add(degree)
        self.client.patch('/students/me/', {'degree': []}, format='json')
        self.student.refresh_from_db()
        self.assertEqual(self.student.degree.count(), 0)

    def test_patch_ignores_non_degree_fields(self):
        response = self.client.patch('/students/me/', {'first_name': 'Otro'}, format='json')
        self.assertEqual(response.status_code, 200)
        self.student.refresh_from_db()
        self.assertEqual(self.student.first_name, 'Pepe')

    def test_delete_returns_204(self):
        response = self.client.delete('/students/me/')
        self.assertEqual(response.status_code, 204)

    def test_delete_removes_student_from_db(self):
        self.client.delete('/students/me/')
        self.assertFalse(Student.objects.filter(email=self.student.email).exists())


class IsAdminMeViewTest(APITestCase):

    def test_returns_false_for_regular_student(self):
        student = make_student()
        login_student(self.client, student)
        response = self.client.get('/students/me/is-admin/')
        self.assertEqual(response.status_code, 200)
        self.assertFalse(response.data['is_admin'])

    def test_returns_true_for_admin_student(self):
        student = make_student(is_admin=True)
        login_student(self.client, student)
        response = self.client.get('/students/me/is-admin/')
        self.assertEqual(response.status_code, 200)
        self.assertTrue(response.data['is_admin'])

    def test_returns_404_when_no_matching_student(self):
        orphan = User.objects.create(username='orphan@test.com', email='orphan@test.com')
        self.client.force_authenticate(user=orphan)
        response = self.client.get('/students/me/is-admin/')
        self.assertEqual(response.status_code, 404)


class StudentCreateViewTest(APITestCase):

    def test_create_returns_201(self):
        payload = {'first_name': 'Ana', 'last_name': 'Lopez', 'email': 'ana@test.com'}
        response = self.client.post('/students/post/', payload, format='json')
        self.assertEqual(response.status_code, 201)

    def test_create_stores_student_in_db(self):
        payload = {'first_name': 'Ana', 'last_name': 'Lopez', 'email': 'ana@test.com'}
        self.client.post('/students/post/', payload, format='json')
        self.assertTrue(Student.objects.filter(email='ana@test.com').exists())

    def test_create_requires_no_authentication(self):
        payload = {'first_name': 'Pub', 'last_name': 'User', 'email': 'public@test.com'}
        response = self.client.post('/students/post/', payload, format='json')
        self.assertEqual(response.status_code, 201)

    def test_create_missing_email_returns_400(self):
        payload = {'first_name': 'Ana', 'last_name': 'Lopez'}
        response = self.client.post('/students/post/', payload, format='json')
        self.assertEqual(response.status_code, 400)

    def test_create_duplicate_email_returns_400(self):
        make_student(email='dupe@test.com')
        payload = {'first_name': 'Ana', 'last_name': 'Lopez', 'email': 'dupe@test.com'}
        response = self.client.post('/students/post/', payload, format='json')
        self.assertEqual(response.status_code, 400)


class StudentListViewTest(APITestCase):

    def setUp(self):
        self.student = make_student()
        login_student(self.client, self.student)

    def test_list_returns_200(self):
        response = self.client.get('/students/')
        self.assertEqual(response.status_code, 200)

    def test_list_returns_all_students(self):
        make_student(email='other@test.com')
        response = self.client.get('/students/')
        self.assertEqual(len(response.data), 2)

    def test_filter_by_email_returns_one(self):
        make_student(email='other@test.com')
        response = self.client.get('/students/', {'email': self.student.email})
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]['email'], self.student.email)

    def test_filter_by_email_no_match_returns_empty(self):
        response = self.client.get('/students/', {'email': 'nobody@test.com'})
        self.assertEqual(response.data, [])
