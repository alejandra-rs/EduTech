from behave import given, when, then
from django.utils import timezone
from datetime import timedelta

FUTURE_DATE = "2027-06-15T10:00:00Z"


@given('que la asignatura tiene sesiones de estudio programadas')
def step_course_has_sessions(context):
    from courses.models import StudySession
    StudySession.objects.create(
        title="Sesión temprana",
        scheduled_at=timezone.now() + timedelta(days=1),
        course=context.course,
        creator=context.student,
    )
    StudySession.objects.create(
        title="Sesión tardía",
        scheduled_at=timezone.now() + timedelta(days=5),
        course=context.course,
        creator=context.student,
    )

@given('estoy en la página de una asignatura')
def step_on_subject_page(context):
    pass


@when('hago clic en "Crear sesión de estudio"')
def step_click_create_session(context):
    pass


@when('escribo el título "{title}", la descripción "{description}" y la fecha "{date}"')
def step_fill_session_form(context, title, description, date):
    context.session_payload = {
        "title": title,
        "description": description,
        "scheduled_at": date,
        "course": context.course.pk,
        "creator": context.student.pk,
    }


@when('hago clic en el botón "Publicar"')
def step_click_publish(context):
    context.response = context.client.post(
        "/courses/study-sessions/",
        context.session_payload,
        format="json",
    )


@when('hago clic en "Publicar" sin escribir un título para la sesión')
def step_publish_without_title(context):
    context.response = context.client.post(
        "/courses/study-sessions/",
        {
            "title": "",
            "description": "Sin título",
            "scheduled_at": FUTURE_DATE,
            "course": context.course.pk,
            "creator": context.student.pk,
        },
        format="json",
    )


@when('hago clic en "Publicar" sin indicar una fecha para la sesión')
def step_publish_without_date(context):
    context.response = context.client.post(
        "/courses/study-sessions/",
        {
            "title": "Sesión sin fecha",
            "description": "",
            "scheduled_at": "",
            "course": context.course.pk,
            "creator": context.student.pk,
        },
        format="json",
    )


@when('accedo a las sesiones de estudio de una asignatura')
def step_access_sessions(context):
    context.response = context.client.get(
        f"/courses/study-sessions/?course={context.course.pk}"
    )



@then('el anuncio aparece listado en las sesiones de estudio planificadas para la asignatura')
def step_session_listed(context):
    from courses.models import StudySession
    assert StudySession.objects.filter(course=context.course).exists(), (
        "No se encontró ninguna sesión de estudio para la asignatura"
    )


@then('el sistema muestra el mensaje de error "{expected_msg}"')
def step_error_message(context, expected_msg):
    detail = context.response.data.get("detail", "")
    assert expected_msg in detail, (
        f'Se esperaba el mensaje "{expected_msg}", se obtuvo: "{detail}"'
    )


@then('no se publica el anuncio en la asignatura')
def step_session_not_published(context):
    from courses.models import StudySession
    assert StudySession.objects.count() == 0, (
        f"Se crearon {StudySession.objects.count()} sesiones cuando no debería haberse creado ninguna"
    )



@then('veo un listado con las sesiones programadas ordenadas cronológicamente')
def step_sessions_listed_chronologically(context):
    data = context.response.data
    assert len(data) >= 2, f"Se esperaban al menos 2 sesiones, se obtuvieron {len(data)}"
    for i in range(len(data) - 1):
        assert data[i]["scheduled_at"] <= data[i + 1]["scheduled_at"], (
            "Las sesiones no están ordenadas cronológicamente"
        )


@then('cada sesión muestra la fecha, la hora y el creador')
def step_sessions_have_required_fields(context):
    for session in context.response.data:
        assert "scheduled_at" in session, f'Falta "scheduled_at" en: {session}'
        assert "creator" in session, f'Falta "creator" en: {session}'
        creator = session["creator"]
        assert "first_name" in creator, f'Falta "first_name" en el creador: {creator}'
        assert "last_name" in creator, f'Falta "last_name" en el creador: {creator}'
