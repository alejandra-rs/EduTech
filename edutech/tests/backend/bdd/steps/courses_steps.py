from behave import given, when, then

@given('que existen las asignaturas "{name1}" y "{name2}" en el curso "{year}"')
def step_crea_asignaturas_en_curso(context, name1, name2, year):
    from courses.models import Year, Course
    curso = Year.objects.get(year=int(year))
    for nombre in (name1, name2):
        Course.objects.get_or_create(name=nombre, year=curso)

@when('pido las asignaturas del curso "{year}"')
def step_pido_asignaturas_curso(context, year):
    from courses.models import Year
    curso = Year.objects.get(year=int(year))
    # Requiere añadir filterset_fields = ['year'] a CourseListCreate
    context.response = context.client.get(f'/courses/?year={curso.pk}')

@when('pido las asignaturas de un curso con id {year_id:d}')
def step_pido_asignaturas_id(context, year_id):
    # Requiere validación de existencia del curso en la vista para devolver 404
    context.response = context.client.get(f'/courses/?year={year_id}')

@then('la respuesta contiene {count:d} asignaturas')
def step_cantidad_asignaturas(context, count):
    data = context.response.data.get('results', context.response.data)
    assert len(data) == count, (
        f'Se esperaban {count} cursos, se encontraron {len(data)}'
    )

@then('los resultados incluyen la asignatura "{name}"')
def step_incluye_asignatura(context, name):
    data = context.response.data.get('results', context.response.data)
    nombres = [c['name'] for c in data]
    assert name in nombres, f'"{name}" no está en {nombres}'