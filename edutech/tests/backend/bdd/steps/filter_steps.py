from behave import given, when, then
from django.core.files.uploadedfile import SimpleUploadedFile
from django.test import override_settings

TEST_STORAGES = {
    'default':     {'BACKEND': 'django.core.files.storage.InMemoryStorage'},
    'staticfiles': {'BACKEND': 'django.contrib.staticfiles.storage.StaticFilesStorage'},
}

def _pdf_file():
    return SimpleUploadedFile('doc.pdf', b'%PDF-xxxxx', content_type='application/pdf')


@given('que existen posts titulados "{title1}" y "{title2}"')
def step_crea_dos_posts(context, title1, title2):
    from documents.models import Post, PDFAttachment
    with override_settings(STORAGES=TEST_STORAGES):
        for titulo in (title1, title2):
            post = Post.objects.create(
                course=context.course, student=context.student,
                title=titulo, description='D', post_type='PDF',
            )
            PDFAttachment.objects.create(post=post, file=_pdf_file())

@given('que existe un post titulado "{title}"')
def step_crea_un_post(context, title):
    from documents.models import Post, PDFAttachment
    with override_settings(STORAGES=TEST_STORAGES):
        post = Post.objects.create(
            course=context.course, student=context.student,
            title=title, description='D', post_type='PDF',
        )
        PDFAttachment.objects.create(post=post, file=_pdf_file())

@given('que existen 2 posts PDF y 2 posts de vídeo en el sistema')
def step_crea_mix_posts(context):
    from documents.models import Post, PDFAttachment, YoutubeVideo
    with override_settings(STORAGES=TEST_STORAGES):
        for i in (1, 2):
            p = Post.objects.create(
                course=context.course, student=context.student,
                title=f'PDF número {i}', description='D', post_type='PDF',
            )
            PDFAttachment.objects.create(post=p, file=_pdf_file())
        for i in (1, 2):
            p = Post.objects.create(
                course=context.course, student=context.student,
                title=f'Vídeo número {i}', description='D', post_type='VID',
            )
            YoutubeVideo.objects.create(
                post=p, vid='https://www.youtube.com/watch?v=abc'
            )



@when('busco posts por el título "{search_term}"')
def step_busca_por_titulo(context, search_term):
    context.response    = context.client.get(f'/documents/?search_title={search_term}')
    context.search_term = search_term

@when('filtro los documentos por tipo "{post_type}"')
def step_filtra_por_tipo(context, post_type):
    context.response = context.client.get(f'/documents/?post_type={post_type}')

@when('filtro los documentos por tipo PDF y VID a la vez')
def step_filtra_pdf_y_vid(context):
    context.response = context.client.get('/documents/?post_type=PDF&post_type=VID')

@when('filtro los documentos por tipo "OTRO"')
def step_filtra_otro(context):
    context.response = context.client.get('/documents/?post_type=OTRO')



@then('encuentro {count:d} resultados')
def step_n_resultados(context, count):
    data = context.response.data.get('results', context.response.data)
    assert len(data) == count, (
        f'Se esperaban {count} resultados, se encontraron {len(data)}'
    )

@then('los títulos de los resultados contienen "{search_term}"')
def step_titulos_contienen(context, search_term):
    data = context.response.data.get('results', context.response.data)
    for item in data:
        assert search_term.lower() in item['title'].lower(), (
            f'El título "{item["title"]}" no contiene "{search_term}"'
        )

@then('todos los resultados son de tipo "{post_type}"')
def step_todos_del_tipo(context, post_type):
    data = context.response.data.get('results', context.response.data)
    for item in data:
        assert item['post_type'] == post_type, (
            f'Se encontró un post de tipo "{item["post_type"]}", '
            f'pero se esperaba "{post_type}"'
        )

@then('los resultados incluyen PDFs y vídeos')
def step_incluye_pdfs_y_videos(context):
    data = context.response.data.get('results', context.response.data)
    tipos = {item['post_type'] for item in data}
    assert 'PDF' in tipos, 'No hay PDFs en los resultados'
    assert 'VID' in tipos, 'No hay vídeos en los resultados'
