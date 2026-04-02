from django.core.files.uploadedfile import SimpleUploadedFile
from unittest.mock import MagicMock
from users.models import Student
from courses.models import Year, Course

TEST_STORAGES = {
    'default':     {'BACKEND': 'django.core.files.storage.InMemoryStorage'},
    'staticfiles': {'BACKEND': 'django.contrib.staticfiles.storage.StaticFilesStorage'},
}

def make_student(**kw):
    defaults = {'first_name': 'Pepe', 'last_name': 'Garcia',
                'email': 'pepe@test.com', 'password': 'x'}
    defaults.update(kw)
    return Student.objects.create(**defaults)

def make_year(year=3):
    return Year.objects.create(year=year)

def make_course(name='Producción de Software', year=None):
    return Course.objects.create(name=name, year=year or make_year())

def make_pdf_file(size_bytes=1024, name='test.pdf'):
    return SimpleUploadedFile(name, b'%PDF-' + b'x' * size_bytes,
                              content_type='application/pdf')

def mock_urlopen():
    mock = MagicMock()
    mock.__enter__ = MagicMock(return_value=mock)
    mock.__exit__  = MagicMock(return_value=False)
    return mock