from rest_framework.test import APITestCase
from courses.models import Subscription
from ..config import make_student, make_course


class SubscriptionViewTest(APITestCase):

    def setUp(self):
        self.student = make_student()
        self.course  = make_course()

    def test_subscribe_returns_201(self):
        response = self.client.post('/courses/sub/', {
            'user': self.student.pk, 'course': self.course.pk,
        }, format='json')
        self.assertEqual(response.status_code, 201)
        self.assertEqual(Subscription.objects.count(), 1)

    def test_subscribe_already_subscribed_returns_200_no_duplicate(self):
        Subscription.objects.create(user=self.student, course=self.course)
        response = self.client.post('/courses/sub/', {
            'user': self.student.pk, 'course': self.course.pk,
        }, format='json')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(Subscription.objects.count(), 1)

    def test_unsubscribe_returns_200(self):
        sub = Subscription.objects.create(user=self.student, course=self.course)
        response = self.client.delete(f'/courses/sub/{sub.pk}')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(Subscription.objects.count(), 0)

    def test_unsubscribe_nonexistent_returns_404(self):
        response = self.client.delete('/courses/sub/99999')
        self.assertEqual(response.status_code, 404)

    def test_get_subscription_exists_returns_id(self):
        sub = Subscription.objects.create(user=self.student, course=self.course)
        response = self.client.get(f'/courses/sub/?user={self.student.pk}&course={self.course.pk}')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data['id'], sub.pk)

    def test_get_subscription_not_exists_returns_empty_dict(self):
        response = self.client.get(f'/courses/sub/?user={self.student.pk}&course={self.course.pk}')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data, {})

    def test_subscribe_to_nonexistent_course_returns_404(self):
        response = self.client.post('/courses/sub/', {
            'user': self.student.pk, 'course': 99999,
        }, format='json')
        self.assertEqual(response.status_code, 404)

    def test_subscribe_with_nonexistent_user_returns_404(self):
        response = self.client.post('/courses/sub/', {
            'user': 99999, 'course': self.course.pk,
        }, format='json')
        self.assertEqual(response.status_code, 404)