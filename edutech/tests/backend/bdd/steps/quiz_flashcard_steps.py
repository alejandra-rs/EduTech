from behave import when, then


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



@when('el estudiante publica un cuestionario con título "{title}"')
def step_upload_valid_quiz(context, title):
    context.response = context.client.post(
        "/documents/upload/quiz/",
        {
            "title": title,
            "description": "Descripción de prueba",
            "course": context.course.pk,
            "student": context.student.pk,
            "questions": [VALID_QUESTION],
        },
        format="json",
    )


@when("el estudiante intenta publicar un cuestionario sin preguntas")
def step_upload_quiz_no_questions(context):
    context.response = context.client.post(
        "/documents/upload/quiz/",
        {
            "title": "Sin preguntas",
            "description": "D",
            "course": context.course.pk,
            "student": context.student.pk,
            "questions": [],
        },
        format="json",
    )


@when("el estudiante intenta publicar un cuestionario con una pregunta de una sola respuesta")
def step_upload_quiz_one_answer(context):
    context.response = context.client.post(
        "/documents/upload/quiz/",
        {
            "title": "Una respuesta",
            "description": "D",
            "course": context.course.pk,
            "student": context.student.pk,
            "questions": [
                {
                    "title": "Pregunta",
                    "answers": [{"text": "Única respuesta", "is_correct": True}],
                }
            ],
        },
        format="json",
    )


@when("el estudiante intenta publicar un cuestionario sin respuestas correctas")
def step_upload_quiz_no_correct_answer(context):
    context.response = context.client.post(
        "/documents/upload/quiz/",
        {
            "title": "Sin correctas",
            "description": "D",
            "course": context.course.pk,
            "student": context.student.pk,
            "questions": [
                {
                    "title": "Pregunta",
                    "answers": [
                        {"text": "A", "is_correct": False},
                        {"text": "B", "is_correct": False},
                    ],
                }
            ],
        },
        format="json",
    )


@when("el estudiante intenta publicar un cuestionario sin especificar asignatura")
def step_upload_quiz_no_course(context):
    context.response = context.client.post(
        "/documents/upload/quiz/",
        {
            "title": "Sin asignatura",
            "description": "D",
            "student": context.student.pk,
            "questions": [VALID_QUESTION],
        },
        format="json",
    )



@when('el estudiante publica un grupo de flashcards con título "{title}"')
def step_upload_valid_flashcard_deck(context, title):
    context.response = context.client.post(
        "/documents/upload/flashcards/",
        {
            "title": title,
            "description": "Descripción de prueba",
            "course": context.course.pk,
            "student": context.student.pk,
            "cards": VALID_CARDS,
        },
        format="json",
    )


@when("el estudiante intenta publicar un grupo de flashcards sin tarjetas")
def step_upload_flashcard_deck_no_cards(context):
    context.response = context.client.post(
        "/documents/upload/flashcards/",
        {
            "title": "Sin tarjetas",
            "description": "D",
            "course": context.course.pk,
            "student": context.student.pk,
            "cards": [],
        },
        format="json",
    )


@when("el estudiante publica un grupo de flashcards con una sola tarjeta")
def step_upload_flashcard_deck_one_card(context):
    context.response = context.client.post(
        "/documents/upload/flashcards/",
        {
            "title": "Una sola tarjeta",
            "description": "D",
            "course": context.course.pk,
            "student": context.student.pk,
            "cards": [{"question": "¿Qué es TDD?", "answer": "Test-Driven Development"}],
        },
        format="json",
    )


@when("el estudiante intenta publicar un grupo de flashcards sin especificar asignatura")
def step_upload_flashcard_deck_no_course(context):
    context.response = context.client.post(
        "/documents/upload/flashcards/",
        {
            "title": "Sin asignatura",
            "description": "D",
            "student": context.student.pk,
            "cards": VALID_CARDS,
        },
        format="json",
    )


    
@then("el cuestionario tiene las preguntas almacenadas")
def step_quiz_has_questions(context):
    from documents.models import Quiz
    quiz = Quiz.objects.first()
    assert quiz is not None, "No se encontró ningún cuestionario en la base de datos"
    assert quiz.questions.count() > 0, "El cuestionario no tiene preguntas almacenadas"


@then("las flashcards están almacenadas en la base de datos")
def step_flashcards_stored(context):
    from documents.models import FlashCard
    count = FlashCard.objects.count()
    assert count > 0, "No se encontraron flashcards en la base de datos"
