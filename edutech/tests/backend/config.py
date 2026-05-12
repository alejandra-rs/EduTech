from django.core.files.uploadedfile import SimpleUploadedFile
from unittest.mock import MagicMock
from users.models import Student
from courses.models import Year, Course, University, Degree

TEST_STORAGES = {
    'default':     {'BACKEND': 'django.core.files.storage.InMemoryStorage'},
    'staticfiles': {'BACKEND': 'django.contrib.staticfiles.storage.StaticFilesStorage'},
}

def make_student(**kw):
    defaults = {'first_name': 'Pepe', 'last_name': 'Garcia',
                'email': 'pepe@test.com', }
    defaults.update(kw)
    return Student.objects.create(**defaults)

def make_university(name="ULPGC", location="Las Palmas"):
    return University.objects.create(name=name, location=location)

def make_degree(name="eii", university=None):
    if university is None:
        university = make_university()
    return Degree.objects.create(name=name, university=university)

def make_year(year=3, degree=None):
    if degree is None:
        degree = make_degree()
    return Year.objects.create(year=year, degree=degree)

def make_course(name='Producción de Software', year=None):
    return Course.objects.create(name=name, year=year or make_year(), semester=1)

def make_pdf_file(size_bytes=1024, name='test.pdf'):
    return SimpleUploadedFile(name, b'%PDF-' + b'x' * size_bytes,
                              content_type='application/pdf')

def mock_urlopen():
    mock = MagicMock()
    mock.__enter__ = MagicMock(return_value=mock)
    mock.__exit__  = MagicMock(return_value=False)
    return mock

def make_post(student=None, course=None, title='Test Post', is_draft=False):
    from documents.models import Post
    return Post.objects.create(
        student=student or make_student(),
        course=course or make_course(),
        title=title, description='D', post_type='PDF', is_draft=is_draft,
    )

def make_root_folder(student=None):
    from student_space.models import Folder
    s = student or make_student()
    root = Folder.objects.filter(student=s, depth=1).first()
    return root if root else Folder.add_root(name='root', student=s)

def make_saved_post(folder=None, post=None):
    from student_space.models import SavedPost
    return SavedPost.objects.create(
        folder=folder or make_root_folder(),
        post=post or make_post(),
    )