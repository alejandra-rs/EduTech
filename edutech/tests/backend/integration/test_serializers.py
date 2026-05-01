from django.test import TestCase, override_settings
from django.core.files.uploadedfile import SimpleUploadedFile
from unittest.mock import patch
from users.serializers import StudentSerializer
from courses.models import Year, Course
from courses.serializers import YearSerializer, CourseSerializer
from documents.models import MAX_PDF_KB
from ..config import TEST_STORAGES, make_student, make_course, make_year, make_pdf_file, mock_urlopen


class StudentSerializerTest(TestCase):
    def test_output_fields(self):
        student = make_student()
        data = StudentSerializer(student).data
        self.assertIn('id', data)
        self.assertIn('first_name', data)
        self.assertIn('last_name', data)
        self.assertIn('email', data)
        self.assertEqual(set(data.keys()), {'id', 'first_name', 'last_name', 'email', 'picture', 'universities' ,'degree'})

    def test_valid_student_data(self):
        data = {
            'first_name': 'Pepe',
            'last_name': 'Garcia',
            'email': 'pepe@test.com',
            'password': 'x'
        }
        serializer = StudentSerializer(data=data)
        self.assertTrue(serializer.is_valid(), serializer.errors)

    def test_student_fields_required(self):
        student = StudentSerializer(data={})
        self.assertFalse(student.is_valid(), student.errors)
        self.assertIn('first_name', student.errors)
        self.assertIn('last_name', student.errors)
        self.assertIn('email', student.errors)

    def test_serialized_student_matches_model(self):
        student = make_student()
        data = StudentSerializer(student).data
        self.assertEqual(data['first_name'], 'Pepe')
        self.assertEqual(data['last_name'], 'Garcia')
        self.assertEqual(data['email'], 'pepe@test.com')


class YearSerializerTest(TestCase):

    def test_output_year_fields(self):
        year = make_year(3)
        data = YearSerializer(year).data
        self.assertIn('id', data)
        self.assertIn('year', data)
        self.assertIn('degree', data)
        self.assertEqual(set(data.keys()), {'id', 'year', 'degree'})

    def test_valid_year_data(self):
        s = YearSerializer(data={'year': 3})
        self.assertTrue(s.is_valid(), s.errors)

    def test_year_field_required(self):
        s = YearSerializer(data={})
        self.assertFalse(s.is_valid())
        self.assertIn('year', s.errors)

    def test_non_int_year_fails_validation(self):
        s = YearSerializer(data={'year': 'Tercero'})
        self.assertFalse(s.is_valid())
        self.assertIn('year', s.errors)

    def test_serialized_object_matches_model(self):
        year = make_year(3)
        self.assertEqual(YearSerializer(year).data['year'], 3)


class CourseSerializerTest(TestCase):

    def setUp(self):
        self.year = make_year()
        self.course = make_course(name='Producción de Software', year=self.year)

    def test_course_contains_correct_fields(self):
        data = CourseSerializer(self.course).data
        for campo in ('id', 'name', 'year'):
            self.assertIn(campo, data)

    def test_correct_nested_year(self):
        data = CourseSerializer(self.course).data
        self.assertIsInstance(data['year'], dict)
        self.assertIn('id', data['year'])
        self.assertIn('year', data['year'])

    def test_year_id_not_in_serialized_output(self):
        data = CourseSerializer(self.course).data
        self.assertNotIn('year_id', data)

    def test_correct_name_in_output(self):
        self.assertEqual(CourseSerializer(self.course).data['name'], 'Producción de Software')

    def test_create_valid_course_passes_validation(self):
        s = CourseSerializer(data={'name': 'Ingeniería de Software', 'year_id': self.year.pk, 'semester': 1})
        self.assertTrue(s.is_valid(), s.errors)

    def test_nonexistent_year_fails_validation(self):
        s = CourseSerializer(data={'name': 'Producción de Software', 'year_id': 99999, 'semester': 1})
        self.assertFalse(s.is_valid())
        self.assertIn('year_id', s.errors)

    def test_required_course_name(self):
        s = CourseSerializer(data={'year_id': self.year.pk})
        self.assertFalse(s.is_valid())
        self.assertIn('name', s.errors)

    def test_duplicated_course_name_fails_validation(self):
        s = CourseSerializer(data={'name': 'Producción de Software', 'year': self.year, 'semester': 1})
        self.assertFalse(s.is_valid())


@override_settings(STORAGES=TEST_STORAGES)
class PDFUploadSerializerTest(TestCase):

    def setUp(self):
        self.course  = make_course()
        self.student = make_student()

    def _valid_data(self, file=None):
        return {
            'title': 'My Doc',
            'description': 'A description',
            'course': self.course.pk,
            'student': self.student.pk,
            'file': file or make_pdf_file(),
        }

    def _serializer(self, data):
        from documents.serializers import PDFUploadSerializer
        return PDFUploadSerializer(data=data)

    def test_valid_pdf_is_valid(self):
        s = self._serializer(self._valid_data())
        self.assertTrue(s.is_valid(), s.errors)

    def test_non_pdf_extension_is_invalid(self):
        bad_file = SimpleUploadedFile('report.txt', b'hello', content_type='text/plain')
        s = self._serializer(self._valid_data(file=bad_file))
        self.assertFalse(s.is_valid())

    def test_oversized_pdf_is_invalid(self):
        big_file = make_pdf_file(size_bytes=(MAX_PDF_KB + 1) * 1024)
        s = self._serializer(self._valid_data(file=big_file))
        self.assertFalse(s.is_valid())

    def test_student_field_is_optional(self):
        data = self._valid_data()
        data.pop('student')
        s = self._serializer(data)
        self.assertTrue(s.is_valid(), s.errors)

    def test_missing_course_fails_validation(self):
        data = self._valid_data()
        data.pop('course')
        s = self._serializer(data)
        self.assertFalse(s.is_valid())
        self.assertIn('course', s.errors)

    def test_missing_title_fails_validation(self):
        data = self._valid_data()
        data.pop('title')
        s = self._serializer(data)
        self.assertFalse(s.is_valid())
        self.assertIn('title', s.errors)


class VideoUploadSerializerTest(TestCase):

    def setUp(self):
        self.course  = make_course()
        self.student = make_student()

    def _valid_data(self, vid='https://www.youtube.com/watch?v=dQw4w9WgXcQ'):
        return {
            'title': 'My Video',
            'description': 'Desc',
            'course': self.course.pk,
            'student': self.student.pk,
            'file': vid,
        }

    def _serializer(self, data):
        from documents.serializers import VideoUploadSerializer
        return VideoUploadSerializer(data=data)

    @patch('documents.serializers.urllib.request.urlopen', return_value=mock_urlopen())
    def test_valid_youtube_url_passes(self, mock_open):
        s = self._serializer(self._valid_data())
        self.assertTrue(s.is_valid(), s.errors)
        call_args = mock_open.call_args[0][0]
        self.assertIn('oembed', call_args)

    @patch('documents.serializers.urllib.request.urlopen', side_effect=Exception('not found'))
    def test_invalid_youtube_url_fails(self, _):
        s = self._serializer(self._valid_data())
        self.assertFalse(s.is_valid())
        self.assertIn('file', s.errors)

    @patch('documents.serializers.urllib.request.urlopen')
    def test_non_url_vid_rejected_before_oembed(self, mock_open):
        s = self._serializer(self._valid_data(vid='not-a-url'))
        self.assertFalse(s.is_valid())
        mock_open.assert_not_called()

    @patch('documents.serializers.urllib.request.urlopen', return_value=mock_urlopen())
    def test_student_is_optional(self, _):
        data = self._valid_data()
        data.pop('student')
        s = self._serializer(data)
        self.assertTrue(s.is_valid(), s.errors)
