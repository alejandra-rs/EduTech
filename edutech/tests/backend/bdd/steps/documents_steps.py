from behave import given, when, then
from django.core.files.uploadedfile import SimpleUploadedFile
from django.test import override_settings
from unittest.mock import patch, MagicMock

TEST_STORAGES = {
    'default':     {'BACKEND': 'django.core.files.storage.InMemoryStorage'},
    'staticfiles': {'BACKEND': 'django.contrib.staticfiles.storage.StaticFilesStorage'},
}
FAKE_PRESIGNED_URL = 'https://r2.example.com/test.pdf?X-Amz-Signature=abc'

def _pdf_file(name='doc.pdf', size=1024):
    return SimpleUploadedFile(
        name, b'%PDF-' + b'x' * size, content_type='application/pdf'
    )

def _mock_urlopen():
    mock = MagicMock()
    mock.__enter__ = MagicMock(return_value=mock)
    mock.__exit__  = MagicMock(return_value=False)
    return mock



@given('que el vídeo de YouTube existe')
def step_oembed_ok(context):
    p = patch(
        'documents.serializers.urllib.request.urlopen',
        return_value=_mock_urlopen(),
    )
    p.start()
    context.patches.append(p)

@given('que el vídeo de YouTube no existe')
def step_oembed_fail(context):
    p = patch(
        'documents.serializers.urllib.request.urlopen',
        side_effect=Exception('vídeo no encontrado en YouTube'),
    )
    p.start()
    context.patches.append(p)

@given('que el curso "{name}" tiene los materiales "{title1}" y "{title2}"')
def step_curso_con_materiales(context, name, title1, title2):
    from courses.models import Course
    from documents.models import Post, PDFAttachment
    curso = Course.objects.get(name=name, year=context.year)
    with override_settings(STORAGES=TEST_STORAGES):
        for titulo in (title1, title2):
            post = Post.objects.create(
                course=curso, student=context.student,
                title=titulo, description='D', post_type='PDF',
            )
            PDFAttachment.objects.create(post=post, file=_pdf_file())

@given('que existe un post PDF con título "{title}"')
def step_crea_post_pdf(context, title):
    from documents.models import Post, PDFAttachment
    with override_settings(STORAGES=TEST_STORAGES):
        post = Post.objects.create(
            course=context.course, student=context.student,
            title=title, description='D', post_type='PDF',
        )
        PDFAttachment.objects.create(post=post, file=_pdf_file())
    context.post = post

@given('que existe un post de tipo vídeo con título "{title}"')
def step_crea_post_video(context, title):
    from documents.models import Post, YoutubeVideo
    post = Post.objects.create(
        course=context.course, student=context.student,
        title=title, description='D', post_type='VID',
    )
    YoutubeVideo.objects.create(post=post, vid='https://www.youtube.com/watch?v=abc')
    context.post = post

@given('que el servicio de almacenamiento devuelve una URL')
def step_almacenamiento_url(context):
    mock_s3 = MagicMock()
    mock_s3.generate_presigned_url.return_value = FAKE_PRESIGNED_URL
    p = patch('documents.views.boto3.client', return_value=mock_s3)
    p.start()
    context.patches.append(p)



@when('el estudiante sube un PDF válido con título "{title}"')
def step_sube_pdf_valido(context, title):
    archivo = _pdf_file()
    with override_settings(STORAGES=TEST_STORAGES):
        context.response = context.client.post('/documents/upload/pdf/', {
            'title': title, 'description': 'Descripción de prueba',
            'course': context.course.pk, 'student': context.student.pk,
            'file': archivo,
        }, format='multipart')

@when('el estudiante intenta subir un PDF que sobrepasa los 600KB')
def step_sube_pdf_grande(context):
    archivo = _pdf_file(size=601 * 1024)
    with override_settings(STORAGES=TEST_STORAGES):
        context.response = context.client.post('/documents/upload/pdf/', {
            'title': 'Prueba', 'description': 'D',
            'course': context.course.pk, 'student': context.student.pk,
            'file': archivo,
        }, format='multipart')

@when('el estudiante intenta subir un archivo llamado "{filename}"')
def step_sube_extension_incorrecta(context, filename):
    archivo = SimpleUploadedFile(filename, b'datos', content_type='application/octet-stream')
    with override_settings(STORAGES=TEST_STORAGES):
        context.response = context.client.post('/documents/upload/pdf/', {
            'title': 'Prueba', 'description': 'D',
            'course': context.course.pk, 'student': context.student.pk,
            'file': archivo,
        }, format='multipart')

@when('el estudiante intenta subir un post sin adjuntar ningún archivo')
def step_sube_sin_archivo(context):
    context.response = context.client.post('/documents/upload/pdf/', {
        'title': 'Prueba', 'description': 'D',
        'course': context.course.pk, 'student': context.student.pk,
    }, format='multipart')

@when('el estudiante sube el vídeo de YouTube "{url}"')
def step_sube_video_valido(context, url):
    context.response = context.client.post('/documents/upload/video/', {
        'title': 'Vídeo de prueba', 'description': 'D',
        'course': context.course.pk, 'student': context.student.pk,
        'vid': url,
    }, format='json')

@when('el estudiante intenta subir el vídeo de YouTube "{url}"')
def step_intenta_video_yt(context, url):
    context.response = context.client.post('/documents/upload/video/', {
        'title': 'Vídeo de prueba', 'description': 'D',
        'course': context.course.pk, 'student': context.student.pk,
        'vid': url,
    }, format='json')

@when('el estudiante intenta subir un link no válido "{url}"')
def step_sube_link_invalido(context, url):
    context.response = context.client.post('/documents/upload/video/', {
        'title': 'Prueba', 'description': 'D',
        'course': context.course.pk, 'student': context.student.pk,
        'vid': url,
    }, format='json')

@when('el estudiante intenta subir un vídeo sin proporcionar URL')
def step_sube_sin_url(context):
    context.response = context.client.post('/documents/upload/video/', {
        'title': 'Prueba', 'description': 'D',
        'course': context.course.pk, 'student': context.student.pk,
    }, format='json')

@when('pido el material de la asignatura "{name}"')
def step_pido_material_curso(context, name):
    from courses.models import Course
    curso = Course.objects.get(name=name, year=context.year)
    # Requiere añadir filtro 'course' a PostFilter para funcionar correctamente
    context.response = context.client.get(f'/documents/?course={curso.pk}')

@when('pido el material de la asignatura con id {course_id:d}')
def step_pido_material_id(context, course_id):
    # Requiere validación de existencia del curso en la vista para devolver 404
    context.response = context.client.get(f'/documents/?course={course_id}')

@when('solicito descargar el PDF del post')
def step_descarga_pdf(context):
    context.response = context.client.get(
        f'/documents/download/pdf/{context.post.pk}'
    )

@when('solicito descargar el post con id {post_id:d}')
def step_descarga_post_id(context, post_id):
    context.response = context.client.get(
        f'/documents/download/pdf/{post_id}'
    )



@then('el archivo de tipo "{post_type}" con título "{title}" aparece en la base de datos')
def step_post_existe_en_bd(context, post_type, title):
    from documents.models import Post
    assert Post.objects.filter(post_type=post_type, title=title).exists(), (
        f'No existe ningún post de tipo {post_type} con título "{title}"'
    )

@then('el archivo aparece listado en los documentos de la asignatura')
def step_post_en_lista(context):
    respuesta = context.client.get('/documents/')
    data = respuesta.data
    assert len(data) >= 1, 'La lista de documentos está vacía'

@then('el post de tipo "VID" existe en la base de datos')
def step_post_vid_existe(context):
    from documents.models import Post
    assert Post.objects.filter(post_type='VID').exists()

@then('el error hace referencia al campo "vid"')
def step_error_vid(context):
    assert 'vid' in context.response.data, (
        f'Se esperaba error en "vid", se obtuvo: {context.response.data}'
    )

@then('la respuesta contiene {count:d} documentos')
def step_cantidad_documentos(context, count):
    data = context.response.data
    assert len(data) == count, (
        f'Se esperaban {count} documentos, se encontraron {len(data)}'
    )

@then('los títulos incluyen "{title1}" y "{title2}"')
def step_titulos_incluyen(context, title1, title2):
    data = context.response.data
    titulos = [d['title'] for d in data]
    assert title1 in titulos, f'"{title1}" no está en {titulos}'
    assert title2 in titulos, f'"{title2}" no está en {titulos}'

@then('la respuesta redirige con un código 302')
def step_redirige_302(context):
    assert context.response.status_code == 302, (
        f'Se esperaba 302, se obtuvo {context.response.status_code}'
    )

@then('la cabecera Location contiene la URL')
def step_location_url(context):
    assert context.response['Location'] == FAKE_PRESIGNED_URL, (
        f'Se esperaba {FAKE_PRESIGNED_URL}, '
        f'se obtuvo {context.response.get("Location")}'
    )