from behave import given, when, then


@given('que soy un estudiante registrado sin titulación asociada')
def step_student_without_degree(context):
    from users.models import Student
    from courses.models import University
    University.objects.get_or_create(name="Universidad de Prueba", location="Las Palmas")
    context.student = Student.objects.create(
        first_name="Ana", last_name="Sin Titulacion",
        email="sin_titulacion@test.com",
    )


@given('que el estudiante tiene la titulación asociada a su perfil')
def step_student_has_degree_in_profile(context):
    context.student.degree.add(context.degree)



@when('accedo a la lista de universidades disponibles')
def step_get_universities(context):
    context.response = context.client.get('/courses/universities/')


@when('el estudiante asocia la titulación a su perfil')
def step_associate_degree_to_profile(context):
    context.response = context.client.patch(
        f'/students/{context.student.pk}/',
        {'degree': [context.degree.pk]},
        format='json',
    )


@when('consulto el perfil del estudiante')
def step_get_student_profile(context):
    context.response = context.client.get(f'/students/{context.student.pk}/')



@then('la lista de universidades incluye opciones para seleccionar')
def step_universities_not_empty(context):
    data = context.response.data
    assert len(data) > 0, "La lista de universidades está vacía, no hay opciones para seleccionar"


@then('el perfil del estudiante refleja la titulación asociada')
def step_degree_reflected_in_profile(context):
    context.student.refresh_from_db()
    assert context.student.degree.filter(pk=context.degree.pk).exists(), (
        f"La titulación (id={context.degree.pk}) no está asociada al perfil del estudiante"
    )


@then('el perfil muestra la titulación asociada')
def step_profile_shows_degree(context):
    data = context.response.data
    degree_ids = [d if isinstance(d, int) else d.get('id', d) for d in data.get('degree', [])]
    assert context.degree.pk in degree_ids, (
        f"La titulación (id={context.degree.pk}) no aparece en el perfil. Titulaciones: {degree_ids}"
    )
