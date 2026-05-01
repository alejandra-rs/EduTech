# tests/backend/unit/test_degrees.py

from django.test import TestCase
from django.db import IntegrityError, transaction
from django.core.exceptions import ValidationError
from courses.models import University, Degree

class DegreeModelTest(TestCase):

    def setUp(self):
        self.uni = University.objects.create(name="ULPGC", location="Las Palmas")
        self.degree = Degree.objects.create(name="Ingeniería Informática", university=self.uni)

    def test_create_valid_degree(self):
        d = Degree.objects.get(pk=self.degree.pk)
        self.assertEqual(d.name, "Ingeniería Informática")
        self.assertEqual(d.university, self.uni)

    def test_str_returns_name(self):
        self.assertEqual(str(self.degree), "Ingeniería Informática")

    def test_unique_constraint_blocks_duplicate_name_university(self):
        with self.assertRaises(IntegrityError):
            with transaction.atomic():
                Degree.objects.create(name="Ingeniería Informática", university=self.uni)

    def test_same_name_different_university_is_allowed(self):
        uni2 = University.objects.create(name="ULL", location="Tenerife")
        d2 = Degree.objects.create(name="Ingeniería Informática", university=uni2)
        self.assertEqual(Degree.objects.filter(name="Ingeniería Informática").count(), 2)

    def test_same_university_different_name_is_allowed(self):
        d2 = Degree.objects.create(name="Arquitectura", university=self.uni)
        self.assertEqual(Degree.objects.filter(university=self.uni).count(), 2)

    def test_name_max_length_enforced(self):
        long_name = "x" * 256
        degree = Degree(name=long_name, university=self.uni)
        with self.assertRaises(ValidationError):
            degree.full_clean()

    def test_cascade_delete_university_removes_degree(self):
        self.uni.delete()
        self.assertFalse(Degree.objects.filter(pk=self.degree.pk).exists())