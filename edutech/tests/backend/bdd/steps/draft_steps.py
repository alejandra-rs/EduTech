from behave import given, when, then
from documents.models import Post, FlashCardDeck, Quiz

VALID_QUESTION = {
    "title": "¿Qué es una prueba unitaria?",
    "answers": [
        {"text": "Un test que prueba una unidad aislada", "is_correct": True},
        {"text": "Un test de integración", "is_correct": False},
    ],
}

VALID_CARDS = [
    {"question": "¿Capital de Francia?", "answer": "París"},
    {"question": "¿Capital de España?", "answer": "Madrid"},
]



@given("que el estudiante tiene un borrador de cuestionario guardado")
def step_student_has_quiz_draft(context):
    post = Post.objects.create(
        course=context.course, student=context.student,
        title="Borrador de cuestionario guardado", description="",
        post_type="QUI", is_draft=True,
    )
    quiz = Quiz.objects.create(post=post)
    q = quiz.questions.create(title=VALID_QUESTION["title"])
    for a in VALID_QUESTION["answers"]:
        q.answers.create(text=a["text"], is_correct=a["is_correct"])
    context.draft = post


@given("que el estudiante tiene un borrador de flashcards guardado")
def step_student_has_fla_draft(context):
    post = Post.objects.create(
        course=context.course, student=context.student,
        title="Borrador de flashcards guardado", description="",
        post_type="FLA", is_draft=True,
    )
    deck = FlashCardDeck.objects.create(post=post)
    for card in VALID_CARDS:
        deck.cards.create(question=card["question"], answer=card["answer"])
    context.draft = post


@given("que otro estudiante tiene un borrador guardado")
def step_other_student_has_draft(context):
    from users.models import Student
    other = Student.objects.create(
        first_name="Otro", last_name="Usuario",
        email="otro@test.com",
    )
    post = Post.objects.create(
        course=context.course, student=other,
        title="Borrador ajeno", description="",
        post_type="FLA", is_draft=True,
    )
    FlashCardDeck.objects.create(post=post)



@when('el estudiante guarda un cuestionario como borrador con título "{title}"')
def step_save_quiz_draft(context, title):
    context.response = context.client.post(
        "/documents/drafts/",
        {
            "post_type": "QUI",
            "title": title,
            "description": "",
            "course": context.course.pk,
            "student": context.student.pk,
            "questions": [VALID_QUESTION],
        },
        format="json",
    )


@when('el estudiante guarda un grupo de flashcards como borrador con título "{title}"')
def step_save_fla_draft(context, title):
    context.response = context.client.post(
        "/documents/drafts/",
        {
            "post_type": "FLA",
            "title": title,
            "description": "",
            "course": context.course.pk,
            "student": context.student.pk,
            "cards": VALID_CARDS,
        },
        format="json",
    )


@when("el estudiante consulta sus borradores")
def step_list_drafts(context):
    context.response = context.client.get(
        f"/documents/drafts/?student={context.student.pk}"
    )


@when("el estudiante obtiene los datos de ese borrador")
def step_get_draft(context):
    context.response = context.client.get(
        f"/documents/drafts/{context.draft.pk}/"
    )


@when("el estudiante actualiza el borrador con nuevas preguntas")
def step_update_draft(context):
    context.response = context.client.patch(
        f"/documents/drafts/{context.draft.pk}/",
        {
            "title": "Borrador actualizado",
            "description": "",
            "questions": [
                {
                    "title": "Nueva pregunta",
                    "answers": [
                        {"text": "Nueva respuesta correcta", "is_correct": True},
                        {"text": "Nueva respuesta incorrecta", "is_correct": False},
                    ],
                }
            ],
        },
        format="json",
    )


@when("el estudiante elimina el borrador")
def step_delete_draft(context):
    context.response = context.client.delete(
        f"/documents/drafts/{context.draft.pk}/"
    )



@then("el borrador no aparece en el listado público de la asignatura")
def step_draft_not_in_public_feed(context):
    response = context.client.get(f"/documents/?course={context.course.pk}")
    ids = [p["id"] for p in response.data]
    draft_id = context.response.data.get("id")
    assert draft_id not in ids, (
        f"El borrador (id={draft_id}) aparece en el listado público"
    )


@then("el borrador aparece en la sección de borradores del estudiante")
def step_draft_in_draft_list(context):
    response = context.client.get(
        f"/documents/drafts/?student={context.student.pk}"
    )
    ids = [d["id"] for d in response.data]
    draft_id = context.response.data.get("id")
    assert draft_id in ids, (
        f"El borrador (id={draft_id}) no aparece en la sección de borradores"
    )


@then("la respuesta contiene {count:d} borradores")
def step_draft_count(context, count):
    actual = len(context.response.data)
    assert actual == count, f"Se esperaban {count} borradores, se encontraron {actual}"


@then('los borradores incluyen uno de tipo "QUI" y otro de tipo "FLA"')
def step_draft_types_present(context):
    types = {d["post_type"] for d in context.response.data}
    assert "QUI" in types, f"Falta borrador de tipo QUI en {types}"
    assert "FLA" in types, f"Falta borrador de tipo FLA en {types}"


@then("la respuesta contiene el título y las preguntas del borrador")
def step_draft_has_title_and_questions(context):
    data = context.response.data
    assert "title" in data, "La respuesta no contiene 'title'"
    assert data["qui"] is not None, "La respuesta no contiene el cuestionario anidado"
    assert len(data["qui"]["questions"]) > 0, "El borrador no tiene preguntas"


@then("el borrador tiene las preguntas actualizadas")
def step_draft_has_updated_questions(context):
    from documents.models import Question
    updated = Question.objects.filter(title="Nueva pregunta")
    assert updated.exists(), "No se encontró la pregunta actualizada en la base de datos"


@then("el borrador ya no existe en la base de datos")
def step_draft_deleted(context):
    exists = Post.objects.filter(pk=context.draft.pk).exists()
    assert not exists, f"El borrador (id={context.draft.pk}) sigue existiendo"
