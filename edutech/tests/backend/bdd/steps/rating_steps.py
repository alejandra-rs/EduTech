from behave import given, when, then


@given('que el estudiante no ha valorado el post')
def step_no_rating(context):
    pass

@given('que el estudiante ha valorado positivamente el post')
def step_like(context):
    from documents.models import Like
    context.like = Like.objects.create(user=context.student, post=context.post)

@given('que el estudiante ha valorado negativamente el post')
def step_dislike(context):
    from documents.models import Dislike
    context.dislike = Dislike.objects.create(user=context.student, post=context.post)

@given('que el estudiante ya ha valorado positivamente el post')
def step_already_liked(context):
    from documents.models import Like
    context.like = Like.objects.create(user=context.student, post=context.post)

@given('que el estudiante ya ha valorado negativamente el post')
def step_already_disliked(context):
    from documents.models import Dislike
    context.dislike = Dislike.objects.create(user=context.student, post=context.post)

@given('que existe un post con {likes:d} votos positivos y {dislikes:d} voto negativo')
def step_post_with_rating(context, likes, dislikes):
    from documents.models import Post, PDFAttachment, Like, Dislike
    from users.models import Student
    from django.core.files.uploadedfile import SimpleUploadedFile
    from django.test import override_settings
    TEST_STORAGES = {
        'default':     {'BACKEND': 'django.core.files.storage.InMemoryStorage'},
        'staticfiles': {'BACKEND': 'django.contrib.staticfiles.storage.StaticFilesStorage'},
    }
    archivo = SimpleUploadedFile('doc.pdf', b'%PDF-xxx', content_type='application/pdf')
    with override_settings(STORAGES=TEST_STORAGES):
        post = Post.objects.create(
            course=context.course, student=context.student,
            title='Post con votos', description='D', post_type='PDF',
        )
        PDFAttachment.objects.create(post=post, file=archivo)
    context.post = post

    for i in range(likes):
        student = Student.objects.create(first_name=f'LikeVoter{i}', last_name='V', email=f'lv{i}@t.com', password='x',)
        Like.objects.create(user=student, post=post)
    for i in range(dislikes):
        student = Student.objects.create(first_name=f'DisVoter{i}', last_name='V', email=f'dv{i}@t.com', password='x',)
        Dislike.objects.create(user=student, post=post)

@given('que existe un post sin valoraciones')
def step_post_without_rating(context):
    from documents.models import Post, PDFAttachment
    from django.core.files.uploadedfile import SimpleUploadedFile
    from django.test import override_settings
    TEST_STORAGES = {
        'default':     {'BACKEND': 'django.core.files.storage.InMemoryStorage'},
        'staticfiles': {'BACKEND': 'django.contrib.staticfiles.storage.StaticFilesStorage'},
    }
    archivo = SimpleUploadedFile('doc.pdf', b'%PDF-xxx', content_type='application/pdf')
    with override_settings(STORAGES=TEST_STORAGES):
        post = Post.objects.create(
            course=context.course, student=context.student,
            title='Post sin votos', description='D', post_type='PDF',
        )
        PDFAttachment.objects.create(post=post, file=archivo)
    context.post = post



@when('el estudiante hace clic en el botón de "Me gusta"')
def step_like_post(context):
    from documents.models import Dislike
    dislike = Dislike.objects.filter(user=context.student, post=context.post).first()
    if dislike:
        context.client.delete(f'/documents/dislikes/{dislike.pk}')
    context.response = context.client.post('/documents/likes/', {
        'user': context.student.pk,
        'post': context.post.pk,
    }, format='json')

@when('el estudiante vuelve a hacer clic en el botón de "Me gusta"')
def step_remove_like(context):
    from documents.models import Like
    like = Like.objects.get(user=context.student, post=context.post)
    context.response = context.client.delete(f'/documents/likes/{like.pk}')

@when('el estudiante hace clic en el botón de "No me gusta"')
def step_dislike_post(context):
    from documents.models import Like
    like = Like.objects.filter(user=context.student, post=context.post).first()
    if like:
        context.client.delete(f'/documents/likes/{like.pk}')
    context.response = context.client.post('/documents/dislikes/', {
        'user': context.student.pk,
        'post': context.post.pk,
    }, format='json')

@when('el estudiante vuelve a hacer clic en el botón de "No me gusta"')
def step_remove_dislike(context):
    from documents.models import Dislike
    dislike = Dislike.objects.get(user=context.student, post=context.post)
    context.response = context.client.delete(f'/documents/dislikes/{dislike.pk}')

@when('pido el detalle del post')
def step_get_post_details(context):
    context.response = context.client.get(f'/documents/{context.post.pk}')



@then('el contador de "Me gusta" del post aumenta en uno')
def step_like_increments(context):
    from documents.models import Like
    count = Like.objects.filter(post=context.post).count()
    assert count >= 1, f'Se esperaba al menos 1 like, hay {count}'

@then('el contador de "Me gusta" del post disminuye en uno')
def step_like_decrements(context):
    from documents.models import Like
    count = Like.objects.filter(post=context.post).count()
    assert count == 0, f'Se esperaba 0 likes, hay {count}'

@then('el voto del estudiante queda registrado como positivo')
def step_like_registered(context):
    from documents.models import Like
    assert Like.objects.filter(user=context.student, post=context.post).exists(), \
        'No existe un like del estudiante para este post'

@then('el voto del estudiante es eliminado')
def step_like_deleted(context):
    from documents.models import Like, Dislike
    assert not Like.objects.filter(user=context.student, post=context.post).exists()
    assert not Dislike.objects.filter(user=context.student, post=context.post).exists()

@then('el contador de "No me gusta" del post aumenta en uno')
def step_dislike_increments(context):
    from documents.models import Dislike
    count = Dislike.objects.filter(post=context.post).count()
    assert count >= 1, f'Se esperaba al menos 1 dislike, hay {count}'

@then('el contador de "No me gusta" del post disminuye en uno')
def step_dislike_decrements(context):
    from documents.models import Dislike
    count = Dislike.objects.filter(post=context.post).count()
    assert count == 0, f'Se esperaba 0 dislikes, hay {count}'

@then('el voto del estudiante queda registrado como negativo')
def step_dislike_registered(context):
    from documents.models import Dislike
    assert Dislike.objects.filter(user=context.student, post=context.post).exists(), \
        'No existe un dislike del estudiante para este post'

@then('la cuenta de likes muestra {likes:d} "Me gusta"')
def step_check_likes_count(context, likes):
    response = context.client.get('/documents/likes/', {
        'user': context.student.pk,
        'post': context.post.pk,
    })
    count = response.data.get('count')
    assert count == likes, f'Se esperaban {likes} likes, se encontraron {count}'

@then('la cuenta de dislikes muestra {dislikes:d} "No me gusta"')
def step_check_dislikes_count(context, dislikes):
    response = context.client.get('/documents/dislikes/', {
        'user': context.student.pk,
        'post': context.post.pk,
    })
    count = response.data.get('count')
    assert count == dislikes, f'Se esperaban {dislikes} dislikes, se encontraron {count}'