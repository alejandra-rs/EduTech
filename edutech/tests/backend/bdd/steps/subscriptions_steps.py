from behave import given, when, then


@given('que el estudiante no está suscrito a la asignatura')
def step_non_subscribed(context):
    pass

@given('que el estudiante ya está suscrito a la asignatura')
def step_already_susbscribed(context):
    from courses.models import Subscription
    context.subscription = Subscription.objects.create(user=context.student, course=context.course)

@given('que el estudiante está suscrito a la asignatura')
def step_subscribed(context):
    from courses.models import Subscription
    context.subscription = Subscription.objects.create(user=context.student, course=context.course)

@given('que existe el estudiante "{full_name}" suscrito a la asignatura')
def step_subscribed_name(context, full_name):
    from users.models import Student
    from courses.models import Subscription
    first, last = full_name.split(' ', 1)
    student = Student.objects.get_or_create(
        first_name=first, last_name=last,
        defaults={'email': f'{first.lower()}@test.com', 'password': 'x'},
    )[0]
    Subscription.objects.create(user=student, course=context.course)
    context.subscriber = student

@given('que existe el estudiante "{full_name}" no suscrito a la asignatura')
def step_non_subscribed_name(context, full_name):
    from users.models import Student
    first, last = full_name.split(' ', 1)
    context.non_subscriber = Student.objects.get_or_create(
        first_name=first, last_name=last,
        defaults={'email': f'{first.lower()}2@test.com', 'password': 'x'},
    )[0]



@when('el estudiante hace clic en el botón "Suscribirme" de la asignatura')
def step_subscribe(context):
    context.response = context.client.post('/courses/sub/',
                                           {'user': context.student.pk, 'course': context.course.pk,},
                                           format='json')

@when('el estudiante intenta suscribirse de nuevo a la asignatura')
def step_subscribe_again(context):
    context.response = context.client.post('/courses/sub/',
                                           {'user': context.student.pk, 'course': context.course.pk,},
                                           format='json')

@when('el estudiante hace clic en "cancelar suscripción"')
def step_cancel_subscription(context):
    context.response = context.client.delete(f'/courses/sub/{context.subscription.pk}')

@when('el estudiante intenta cancelar la suscripción')
def step_cancel_without_subscription(context):
    context.response = context.client.delete('/courses/sub/99999')

@when('el estudiante "{full_name}" sube un PDF con título "{title}" a la asignatura')
def step_student_uploads_pdf(context, full_name, title):
    from users.models import Student
    from django.core.files.uploadedfile import SimpleUploadedFile
    from django.test import override_settings
    TEST_STORAGES = {
        'default':     {'BACKEND': 'django.core.files.storage.InMemoryStorage'},
        'staticfiles': {'BACKEND': 'django.contrib.staticfiles.storage.StaticFilesStorage'},
    }
    first, last = full_name.split(' ', 1)
    uploader = Student.objects.get(first_name=first, last_name=last)
    archivo = SimpleUploadedFile('doc.pdf', b'%PDF-xxxx', content_type='application/pdf')
    with override_settings(STORAGES=TEST_STORAGES):
        context.response = context.client.post('/documents/upload/pdf/', {
            'title': title, 'description': 'D',
            'course': context.course.pk, 'student': uploader.pk,
            'file': archivo,
        }, format='multipart')



@then('el estudiante queda suscrito a la asignatura')
def step_subscription_registered(context):
    from courses.models import Subscription
    assert Subscription.objects.filter(user=context.student, course=context.course).exists()

@then('la asignatura aparece en el listado de asignaturas suscritas del estudiante')
def step_course_in_student_subscriptions(context):
    from courses.models import Subscription
    assert Subscription.objects.filter(user=context.student, course=context.course).exists()

@then('el estudiante continúa suscrito a la asignatura')
def step_student_keeps_subscribed(context):
    from courses.models import Subscription
    count = Subscription.objects.filter(user=context.student, course=context.course).count()
    assert count == 1, f'Se esperaba 1 suscripción, hay {count}'

@then('el estudiante ya no está suscrito a la asignatura')
def step_subscription_non_registered(context):
    from courses.models import Subscription
    assert not Subscription.objects.filter(user=context.student, course=context.course).exists()

@then('la asignatura desaparece del listado de asignaturas suscritas del estudiante')
def step_course_not_in_student_subscriptions(context):
    from courses.models import Subscription
    assert not Subscription.objects.filter(user=context.student, course=context.course).exists()

@then('el estudiante continúa sin estar suscrito a la asignatura')
def step_student_keeps_unsubscribed(context):
    from courses.models import Subscription
    assert not Subscription.objects.filter(user=context.student, course=context.course).exists()

@then('el estudiante "{full_name}" recibe una notificación por correo electrónico')
def step_notification(context, full_name):
    from django.core import mail
    from users.models import Student
    first, last = full_name.split(' ', 1)
    student = Student.objects.get(first_name=first, last_name=last)
    recipients = [addr for m in mail.outbox for addr in m.to]
    assert student.email in recipients, f'No se encontró email a {student.email}. Enviados a: {recipients}'

@then('la notificación contiene información sobre el nuevo contenido subido')
def step_notification_with_data(context):
    from django.core import mail
    assert len(mail.outbox) >= 1, 'No se enviaron emails'
    assert mail.outbox[0].subject
    assert mail.outbox[0].body

@then('el estudiante "{full_name}" no recibe ninguna notificación')
def step_no_notification(context, full_name):
    from django.core import mail
    from users.models import Student
    first, last = full_name.split(' ', 1)
    student = Student.objects.get(first_name=first, last_name=last)
    recipients = [addr for m in mail.outbox for addr in m.to]
    assert student.email not in recipients, f'Se encontró un email a {student.email} cuando no debería haberlo'