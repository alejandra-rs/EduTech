# tests/backend/unit/test_universities.py

from django.test import TestCase
from django.db import IntegrityError, transaction
from django.core.exceptions import ValidationError
from courses.models import University

class UniversityModelTest(TestCase):

    def setUp(self):
        self.uni_ulpgc = University.objects.create(
            name="ULPGC", location="Las Palmas"
        )

    def test_create_valid_university(self):
        uni = University.objects.get(pk=self.uni_ulpgc.pk)
        self.assertEqual(uni.name, "ULPGC")
        self.assertEqual(uni.location, "Las Palmas")

    def test_str_returns_name_and_location(self):
        self.assertEqual(str(self.uni_ulpgc), "ULPGC - Las Palmas")

    def test_blank_logo_is_allowed(self):
        self.assertEqual(self.uni_ulpgc.logo.name, "")

    def test_unique_constraint_blocks_duplicate_name_location(self):
        with self.assertRaises(IntegrityError):
            with transaction.atomic():
                University.objects.create(name="ULPGC", location="Las Palmas")

    def test_same_name_different_location_is_allowed(self):
        uni2 = University.objects.create(name="ULPGC", location="Tenerife")
        self.assertEqual(University.objects.filter(name="ULPGC").count(), 2)

    def test_same_location_different_name_is_allowed(self):
        uni2 = University.objects.create(name="Otra Uni", location="Las Palmas")
        self.assertEqual(University.objects.filter(location="Las Palmas").count(), 2)

    def test_name_max_length_enforced(self):
        long_name = "x" * 256
        uni = University(name=long_name, location="Test Location")
        with self.assertRaises(ValidationError):
            uni.full_clean()

    def test_location_max_length_enforced(self):
        long_location = "y" * 256
        uni = University(name="Test Name", location=long_location)
        with self.assertRaises(ValidationError):
            uni.full_clean()