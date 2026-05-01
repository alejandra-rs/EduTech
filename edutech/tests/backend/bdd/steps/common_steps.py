from behave import given, then

@given('que existe el curso "{year}"')
def step_year_exists(context, year):
    from courses.models import University, Degree, Year
    university, _ = University.objects.get_or_create(
        name="Universidad de Prueba", location="Las Palmas"
    )
    degree, _ = Degree.objects.get_or_create(
        name="Titulación de Prueba", university=university
    )
    context.university = university
    context.degree = degree
    context.year = Year.objects.get_or_create(year=int(year), degree=degree)[0]

@given('que existe la asignatura "{name}" para ese año')
def step_course_exists(context, name):
    from courses.models import Course
    context.course = Course.objects.get_or_create(name=name, year=context.year, defaults={'semester': 1})[0]

@given('que existe el estudiante "{full_name}"')
def step_student_exists(context, full_name):
    from users.models import Student
    first, last = full_name.split(' ', 1)
    context.student = Student.objects.get_or_create(
        first_name=first, last_name=last,
        defaults={'email': 'test@test.com'},
    )[0]



@then('la respuesta tiene el estado {code:d}')
def step_response_status(context, code):
    assert context.response.status_code == code, (
        f'Se esperaba {code}, se obtuvo {context.response.status_code}. '
        f'Cuerpo: {getattr(context.response, "data", context.response.content)}'
    )

@then('no se guarda el archivo')
def step_post_not_created(context):
    from documents.models import Post
    count = Post.objects.count()
    assert count == 0, f'Se esperaba 0 posts, pero hay {count}'