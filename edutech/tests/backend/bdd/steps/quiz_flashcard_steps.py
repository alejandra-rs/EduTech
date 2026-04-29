from behave import given, when, then


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



@when("el estudiante crea un cuestionario con título, descripción y preguntas")
def step_create_quiz_full(context):
    context.response = context.client.post(
        "/documents/upload/quiz/",
        {
            "title": "Cuestionario Tema 1",
            "description": "Descripción del cuestionario",
            "course": context.course.pk,
            "student": context.student.pk,
            "questions": [VALID_QUESTION],
        },
        format="json",
    )


@when("el estudiante crea un cuestionario con 3 preguntas distintas")
def step_create_quiz_three_questions(context):
    questions = [
        {
            "title": f"Pregunta {i}",
            "answers": [
                {"text": "Correcta", "is_correct": True},
                {"text": "Incorrecta", "is_correct": False},
            ],
        }
        for i in range(1, 4)
    ]
    context.response = context.client.post(
        "/documents/upload/quiz/",
        {
            "title": "Cuestionario con 3 preguntas",
            "description": "D",
            "course": context.course.pk,
            "student": context.student.pk,
            "questions": questions,
        },
        format="json",
    )


@when("el estudiante intenta publicar un cuestionario con una pregunta sin título")
def step_create_quiz_empty_question_title(context):
    context.response = context.client.post(
        "/documents/upload/quiz/",
        {
            "title": "Cuestionario",
            "description": "D",
            "course": context.course.pk,
            "student": context.student.pk,
            "questions": [
                {
                    "title": "",
                    "answers": [
                        {"text": "A", "is_correct": True},
                        {"text": "B", "is_correct": False},
                    ],
                }
            ],
        },
        format="json",
    )


@when("el estudiante intenta publicar un cuestionario sin título")
def step_upload_quiz_no_title(context):
    context.response = context.client.post(
        "/documents/upload/quiz/",
        {
            "title": "",
            "description": "D",
            "course": context.course.pk,
            "student": context.student.pk,
            "questions": [VALID_QUESTION],
        },
        format="json",
    )


@then("el cuestionario almacena las 3 preguntas")
def step_quiz_has_three_questions(context):
    from documents.models import Question
    count = Question.objects.count()
    assert count == 3, f"Se esperaban 3 preguntas, hay {count}"


@then("el cuestionario aparece listado en los materiales de la asignatura")
def step_quiz_in_course_list(context):
    response = context.client.get(f"/documents/?course={context.course.pk}")
    types = [p["post_type"] for p in response.data]
    assert "QUI" in types, f"No hay cuestionarios en la lista: {types}"



@then('la respuesta contiene error en el campo "title"')
def step_error_in_title(context):
    assert "title" in context.response.data, (
        f"Se esperaba error en 'title', se obtuvo: {context.response.data}"
    )



@given("que existe un cuestionario publicado con preguntas y respuestas")
def step_published_quiz_exists(context):
    from documents.models import Post, Quiz, Question, Answer
    post = Post.objects.create(
        course=context.course, student=context.student,
        title="Quiz de autoevaluación", description="D",
        post_type="QUI", is_draft=False,
    )
    quiz = Quiz.objects.create(post=post)
    question = Question.objects.create(quiz=quiz, title="¿Qué es TDD?")
    context.correct_answer = Answer.objects.create(
        question=question, text="Test-Driven Development", is_correct=True
    )
    context.wrong_answer = Answer.objects.create(
        question=question, text="Una metodología ágil", is_correct=False
    )
    context.quiz_post = post
    context.question = question


@when("el estudiante envía las respuestas correctas al cuestionario")
def step_submit_correct_answers(context):
    context.response = context.client.post(
        f"/documents/{context.quiz_post.pk}/quiz/check/",
        {"responses": [{"question": context.question.pk, "selected": [context.correct_answer.pk]}]},
        format="json",
    )


@when("el estudiante envía una respuesta incorrecta al cuestionario")
def step_submit_wrong_answer(context):
    context.response = context.client.post(
        f"/documents/{context.quiz_post.pk}/quiz/check/",
        {"responses": [{"question": context.question.pk, "selected": [context.wrong_answer.pk]}]},
        format="json",
    )


@when("el estudiante envía el cuestionario sin seleccionar ninguna respuesta")
def step_submit_no_answer(context):
    context.response = context.client.post(
        f"/documents/{context.quiz_post.pk}/quiz/check/",
        {"responses": [{"question": context.question.pk, "selected": []}]},
        format="json",
    )


@then("la puntuación obtenida es {score:d} de {total:d}")
def step_score_is(context, score, total):
    data = context.response.data
    assert data["score"] == score, f"Se esperaba puntuación {score}, se obtuvo {data['score']}"
    assert data["total"] == total, f"Se esperaba total {total}, se obtuvo {data['total']}"


@then("los resultados indican que la pregunta fue acertada")
def step_result_is_correct(context):
    result = context.response.data["results"][0]
    assert result["correct"] is True, "Se esperaba que la pregunta fuera correcta"


@then("los resultados muestran las respuestas correctas para los fallos")
def step_result_shows_correct_answers(context):
    result = context.response.data["results"][0]
    assert result["correct"] is False, "Se esperaba que la pregunta fuera incorrecta"
    assert context.correct_answer.pk in result["correct_answers"], (
        f"La respuesta correcta no está en correct_answers: {result['correct_answers']}"
    )



@when("el estudiante crea un grupo de flashcards con título, descripción y tarjetas")
def step_create_fla_full(context):
    context.response = context.client.post(
        "/documents/upload/flashcards/",
        {
            "title": "Vocabulario Tema 3",
            "description": "Descripción del grupo",
            "course": context.course.pk,
            "student": context.student.pk,
            "cards": VALID_CARDS,
        },
        format="json",
    )


@when("el estudiante crea un grupo de flashcards con 3 tarjetas distintas")
def step_create_fla_three_cards(context):
    context.response = context.client.post(
        "/documents/upload/flashcards/",
        {
            "title": "Grupo con 3 tarjetas",
            "description": "D",
            "course": context.course.pk,
            "student": context.student.pk,
            "cards": [
                {"question": f"Pregunta {i}", "answer": f"Respuesta {i}"}
                for i in range(1, 4)
            ],
        },
        format="json",
    )


@when("el estudiante intenta publicar un grupo de flashcards sin título")
def step_upload_fla_no_title(context):
    context.response = context.client.post(
        "/documents/upload/flashcards/",
        {
            "title": "",
            "description": "D",
            "course": context.course.pk,
            "student": context.student.pk,
            "cards": VALID_CARDS,
        },
        format="json",
    )


@then("el grupo almacena las 3 tarjetas")
def step_deck_has_three_cards(context):
    from documents.models import FlashCard
    count = FlashCard.objects.count()
    assert count == 3, f"Se esperaban 3 tarjetas, hay {count}"


@then("el grupo aparece listado en los materiales de la asignatura")
def step_fla_in_course_list(context):
    response = context.client.get(f"/documents/?course={context.course.pk}")
    types = [p["post_type"] for p in response.data]
    assert "FLA" in types, f"No hay flashcards en la lista: {types}"
