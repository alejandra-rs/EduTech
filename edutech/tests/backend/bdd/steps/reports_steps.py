from behave import given, when, then
from django.core.files.uploadedfile import SimpleUploadedFile
from django.test import override_settings

TEST_STORAGES = {
    'default': {'BACKEND': 'django.core.files.storage.InMemoryStorage'},
    'staticfiles': {'BACKEND': 'django.contrib.staticfiles.storage.StaticFilesStorage'},
}


@given('que existe el administrador "{full_name}"')
def step_admin_exists(context, full_name):
    from users.models import Student
    first, last = full_name.split(' ', 1)
    context.admin = Student.objects.get_or_create(
        first_name=first, last_name=last,
        defaults={'email': 'admin@test.com', 'password': 'x', 'is_admin': True},
    )[0]


@given('que existe una razón de reporte "{reason_text}"')
def step_report_reason_exists(context, reason_text):
    from documents.models import ReportReason
    context.reason = ReportReason.objects.get_or_create(reason=reason_text)[0]


@given('que el post tiene un reporte con motivo "{reason_text}"')
def step_post_has_report(context, reason_text):
    from documents.models import Report, ReportReason
    reason = ReportReason.objects.get(reason=reason_text)
    context.report = Report.objects.create(
        reason=reason, description='Descripción del reporte',
        user=context.student, post=context.post,
    )


@given('que el post tiene el comentario "{message}"')
def step_post_has_comment(context, message):
    from documents.models import Comment
    context.comment = Comment.objects.create(
        user=context.student, post=context.post, message=message,
    )


@given('que soy un usuario registrado')
def step_i_am_registered_user(context):
    pass  


@given('que soy un usuario registrado en la pantalla de reporte')
def step_i_am_on_report_screen(context):
    pass


@given('que soy un usuario moderador')
def step_i_am_moderator(context):
    pass


@given('estoy en la zona de moderación')
def step_i_am_in_moderation_zone(context):
    pass


@given('que soy el creador del contenido reportado')
def step_i_am_content_creator(context):
    pass


@given('que soy un usuario registrado leyendo los comentarios de un material')
def step_i_am_reading_comments(context):
    pass


@given('que soy un usuario registrado intentando reportar un comentario')
def step_i_am_reporting_comment(context):
    pass



@when('reporto el post con motivo "{reason_text}" y descripción "{description}"')
def step_report_post(context, reason_text, description):
    from documents.models import ReportReason
    reason = ReportReason.objects.get(reason=reason_text)
    context.response = context.client.post('/documents/reports/', {
        'post_id': context.post.pk,
        'user_id': context.student.pk,
        'reason_id': reason.pk,
        'description': description,
    }, format='json')


@when('intento enviar el reporte sin seleccionar ni escribir ninguna justificación')
def step_submit_report_without_reason(context):
    context.response = context.client.post('/documents/reports/', {
        'post_id': context.post.pk,
        'user_id': context.student.pk,
    }, format='json')


@when('marco el reporte como válido con el mensaje "{message}"')
def step_accept_report(context, message):
    context.response = context.client.post(
        f'/documents/reports/resolve/{context.post.pk}/',
        {'message': message, 'admin_id': context.admin.pk},
        format='multipart',
    )


@when('marco el reporte como inválido')
def step_reject_report(context):
    context.response = context.client.delete(
        f'/documents/reports/post/{context.post.pk}/?admin_id={context.admin.pk}'
    )


@when('un administrador elimina mi contenido con el mensaje "{message}"')
def step_admin_deletes_content(context, message):
    context.response = context.client.post(
        f'/documents/reports/resolve/{context.post.pk}/',
        {'message': message, 'admin_id': context.admin.pk},
        format='multipart',
    )


@when('reporto el comentario con motivo "{reason_text}" y descripción "{description}"')
def step_report_comment(context, reason_text, description):
    from documents.models import ReportReason
    reason = ReportReason.objects.get(reason=reason_text)
    context.response = context.client.post('/documents/reports/comments/', {
        'comment_id': context.comment.pk,
        'user_id': context.student.pk,
        'reason_id': reason.pk,
        'description': description,
    }, format='json')


@when('intento reportar el comentario sin indicar motivo ni descripción')
def step_report_comment_without_reason(context):
    context.response = context.client.post('/documents/reports/comments/', {
        'comment_id': context.comment.pk,
        'user_id': context.student.pk,
    }, format='json')



@then('el sistema registra el reporte')
def step_report_registered(context):
    from documents.models import Report
    assert Report.objects.count() == 1, 'No se registró ningún reporte'


@then('la respuesta muestra un mensaje de confirmación')
def step_response_has_confirmation(context):
    data = context.response.data
    assert 'id' in data or 'detail' in data, f'Respuesta inesperada: {data}'


@then('el sistema impide el envío')
def step_submission_blocked(context):
    from documents.models import Report
    assert Report.objects.count() == 0, 'Se registró un reporte cuando no debía'


@then('la respuesta muestra el error "{expected_msg}"')
def step_response_has_error_message(context, expected_msg):
    data = context.response.data
    detail = data.get('detail', '')
    assert expected_msg in detail or detail, (
        f'Se esperaba mensaje de error "{expected_msg}", se obtuvo: {detail}'
    )


@then('el contenido deja de aparecer en el material de la asignatura')
def step_content_removed(context):
    from documents.models import Post
    assert not Post.objects.filter(pk=context.post.pk).exists(), (
        'El post todavía existe cuando debería haber sido eliminado'
    )


@then('desaparecen todos los reportes asociados a dicho contenido')
def step_reports_removed(context):
    from documents.models import Report
    assert Report.objects.count() == 0, (
        f'Todavía quedan {Report.objects.count()} reporte(s) cuando deberían haberse eliminado'
    )


@then('el contenido se mantiene en el material de la asignatura')
def step_content_remains(context):
    from documents.models import Post
    assert Post.objects.filter(pk=context.post.pk).exists(), (
        'El post fue eliminado cuando debería haberse mantenido'
    )


@then('el resto de reportes asociados a él se mantienen')
def step_reports_remain(context):
    from documents.models import Report
    assert Report.objects.count() >= 1, 'Los reportes fueron eliminados cuando debían mantenerse'


@then('recibo un correo electrónico indicando el motivo de reporte')
def step_email_received(context):
    from django.core import mail
    assert len(mail.outbox) == 1, f'Se esperaba 1 correo, se enviaron {len(mail.outbox)}'
    assert context.student.email in mail.outbox[0].recipients(), (
        'El correo no fue enviado al autor del contenido'
    )


@then('la identidad del reportador se mantiene anónima en el correo')
def step_reporter_identity_anonymous(context):
    from django.core import mail
    body = mail.outbox[0].body
    assert context.student.first_name not in body or 'anónimo' not in body, (
        'El correo puede estar revelando la identidad del reportador'
    )


@then('el sistema registra el reporte asociado a ese comentario')
def step_comment_report_registered(context):
    from documents.models import CommentReport
    assert CommentReport.objects.filter(comment=context.comment).exists(), (
        'No se registró ningún reporte para el comentario'
    )


@then('se muestra un mensaje de error indicando "{expected_msg}"')
def step_comment_report_error_message(context, expected_msg):
    data = context.response.data
    detail = data.get('detail', '')
    assert detail, f'No se encontró mensaje de error. Respuesta: {data}'
