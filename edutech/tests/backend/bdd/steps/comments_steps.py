from behave import given, when, then

@given('que el post tiene los comentarios "{c1}" y "{c2}"')
def step_post_with_comments(context, c1, c2):
    from documents.models import Comment
    for msg in (c1, c2):
        Comment.objects.create(user=context.student, post=context.post, message=msg)



@when('el estudiante publica el comentario "{message}"')
def step_post_comment(context, message):
    context.response = context.client.post(
        f'/documents/comments/?post={context.post.pk}&user={context.student.pk}',
        {'message': message},
        format='json',
    )

@when('el estudiante intenta publicar un comentario vacío')
def step_post_empty_comment(context):
    context.response = context.client.post(
        f'/documents/comments/?post={context.post.pk}&user={context.student.pk}',
        {'message': ''},
        format='json',
    )

@when('pido los comentarios del post')
def step_get_comments(context):
    context.response = context.client.get(f'/documents/comments/?post={context.post.pk}')



@then('el comentario aparece en la sección de comentarios del post')
def step_comment_in_post(context):
    from documents.models import Comment
    assert Comment.objects.filter(post=context.post).exists(), 'No existe ningún comentario para este post'

@then('el comentario muestra el autor, la fecha y la hora')
def step_comment_fields_post(context):
    data = context.response.data
    assert 'user' in data, 'El comentario no incluye el autor'
    assert 'created_at' in data, 'El comentario no incluye la fecha y hora de creación'

@then('no se publica el comentario')
def step_comment_not_posted(context):
    from documents.models import Comment
    assert Comment.objects.count() == 0, 'Se publicó un comentario cuando no debía'

@then('la respuesta contiene {count:d} comentarios')
def step_comment_count(context, count):
    data = context.response.data
    assert len(data) == count, f'Se esperaban {count} comentarios, hay {len(data)}'

@then('los comentarios están ordenados cronológicamente')
def step_ordered_comments(context):
    data = context.response.data
    if len(data) < 2:
        return
    for i in range(len(data) - 1):
        assert data[i]['created_at'] <= data[i + 1]['created_at'], 'Los comentarios no están ordenados cronológicamente'

@then('cada comentario muestra el autor, el contenido, la fecha y la hora')
def step_comment_fields(context):
    for comment in context.response.data:
        assert 'user'       in comment, f'Falta "user" en comentario: {comment}'
        assert 'message'    in comment, f'Falta "message" en comentario: {comment}'
        assert 'created_at' in comment, f'Falta "created_at" en comentario: {comment}'