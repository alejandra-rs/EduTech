from behave import given, when, then

@given('que existen las asignaturas "{name1}" y "{name2}" en el curso "{year}"')
def step_create_courses_on_year(context, name1, name2, year):
    from courses.models import Year, Course
    curso = Year.objects.get(year=int(year))
    for nombre in (name1, name2):
        Course.objects.get_or_create(name=nombre, year=curso, semester=1)

@when('pido las asignaturas del curso "{year}"')
def step_find_courses_by_year(context, year):
    from courses.models import Year
    curso = Year.objects.get(year=int(year))
    # Requiere añadir filterset_fields = ['year'] a CourseListCreate
    context.response = context.client.get(f'/courses/?year={curso.pk}')

@when('pido las asignaturas de un curso con id {year_id:d}')
def step_find_courses_by_id(context, year_id):
    context.response = context.client.get(f'/courses/?year={year_id}')

@then('la respuesta contiene {count:d} asignaturas')
def step_course_count(context, count):
    data = context.response.data
    assert len(data) == count, (
        f'Se esperaban {count} cursos, se encontraron {len(data)}'
    )

@then('los resultados incluyen la asignatura "{name}"')
def step_includes_course(context, name):
    data = context.response.data
    nombres = [c['name'] for c in data]
    assert name in nombres, f'"{name}" no está en {nombres}'