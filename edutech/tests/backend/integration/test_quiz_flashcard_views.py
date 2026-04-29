from rest_framework.test import APITestCase
from documents.models import Post, Quiz, Question, Answer, FlashCardDeck, FlashCard
from ..config import make_student, make_course


VALID_QUIZ_PAYLOAD = {
    "title": "Cuestionario de prueba",
    "description": "Descripción de prueba",
    "questions": [
        {
            "title": "¿Qué es Python?",
            "answers": [
                {"text": "Un lenguaje de programación", "is_correct": True},
                {"text": "Un animal", "is_correct": False},
            ],
        }
    ],
}

VALID_FLASHCARD_PAYLOAD = {
    "title": "Grupo de flashcards",
    "description": "Descripción",
    "cards": [
        {"question": "¿Capital de Francia?", "answer": "París"},
        {"question": "¿Capital de España?", "answer": "Madrid"},
    ],
}


class QuizUploadViewTest(APITestCase):

    def setUp(self):
        self.student = make_student()
        self.course = make_course()

    def _post(self, **overrides):
        payload = {**VALID_QUIZ_PAYLOAD, "course": self.course.pk, "student": self.student.pk}
        payload.update(overrides)
        return self.client.post("/documents/upload/quiz/", payload, format="json")

    def test_valid_quiz_returns_201(self):
        response = self._post()
        self.assertEqual(response.status_code, 201)

    def test_valid_quiz_creates_post_and_quiz(self):
        self._post()
        self.assertEqual(Post.objects.count(), 1)
        self.assertEqual(Quiz.objects.count(), 1)
        self.assertEqual(Post.objects.first().post_type, "QUI")

    def test_valid_quiz_creates_questions_and_answers(self):
        self._post()
        self.assertEqual(Question.objects.count(), 1)
        self.assertEqual(Answer.objects.count(), 2)

    def test_response_shape_matches_post_serializer(self):
        response = self._post()
        for key in ("id", "title", "post_type", "course", "student", "qui"):
            self.assertIn(key, response.data)

    def test_missing_questions_returns_400(self):
        response = self._post(questions=[])
        self.assertEqual(response.status_code, 400)
        self.assertIn("questions", response.data)

    def test_question_with_only_one_answer_returns_400(self):
        payload = {
            **VALID_QUIZ_PAYLOAD,
            "questions": [
                {
                    "title": "Q",
                    "answers": [{"text": "A", "is_correct": True}],
                }
            ],
        }
        response = self._post(**payload)
        self.assertEqual(response.status_code, 400)

    def test_question_with_no_correct_answer_returns_400(self):
        payload = {
            **VALID_QUIZ_PAYLOAD,
            "questions": [
                {
                    "title": "Q",
                    "answers": [
                        {"text": "A", "is_correct": False},
                        {"text": "B", "is_correct": False},
                    ],
                }
            ],
        }
        response = self._post(**payload)
        self.assertEqual(response.status_code, 400)

    def test_missing_course_returns_400(self):
        payload = {**VALID_QUIZ_PAYLOAD, "student": self.student.pk}
        response = self.client.post("/documents/upload/quiz/", payload, format="json")
        self.assertEqual(response.status_code, 400)

    def test_no_post_created_on_invalid_quiz(self):
        self._post(questions=[])
        self.assertEqual(Post.objects.count(), 0)

    def test_multiple_questions_all_stored(self):
        payload = {
            **VALID_QUIZ_PAYLOAD,
            "questions": [
                {
                    "title": f"Pregunta {i}",
                    "answers": [
                        {"text": "Correcta", "is_correct": True},
                        {"text": "Incorrecta", "is_correct": False},
                    ],
                }
                for i in range(3)
            ],
        }
        self._post(**payload)
        self.assertEqual(Question.objects.count(), 3)


class FlashCardDeckUploadViewTest(APITestCase):

    def setUp(self):
        self.student = make_student()
        self.course = make_course()

    def _post(self, **overrides):
        payload = {**VALID_FLASHCARD_PAYLOAD, "course": self.course.pk, "student": self.student.pk}
        payload.update(overrides)
        return self.client.post("/documents/upload/flashcards/", payload, format="json")

    def test_valid_deck_returns_201(self):
        response = self._post()
        self.assertEqual(response.status_code, 201)

    def test_valid_deck_creates_post_and_deck(self):
        self._post()
        self.assertEqual(Post.objects.count(), 1)
        self.assertEqual(FlashCardDeck.objects.count(), 1)
        self.assertEqual(Post.objects.first().post_type, "FLA")

    def test_valid_deck_creates_flashcards(self):
        self._post()
        self.assertEqual(FlashCard.objects.count(), 2)

    def test_response_shape_matches_post_serializer(self):
        response = self._post()
        for key in ("id", "title", "post_type", "course", "student", "fla"):
            self.assertIn(key, response.data)

    def test_empty_cards_returns_400(self):
        response = self._post(cards=[])
        self.assertEqual(response.status_code, 400)
        self.assertIn("cards", response.data)

    def test_missing_course_returns_400(self):
        payload = {**VALID_FLASHCARD_PAYLOAD, "student": self.student.pk}
        response = self.client.post("/documents/upload/flashcards/", payload, format="json")
        self.assertEqual(response.status_code, 400)

    def test_no_post_created_on_invalid_deck(self):
        self._post(cards=[])
        self.assertEqual(Post.objects.count(), 0)

    def test_card_data_stored_correctly(self):
        self._post()
        card = FlashCard.objects.get(question="¿Capital de Francia?")
        self.assertEqual(card.answer, "París")

    def test_single_card_is_valid(self):
        response = self._post(cards=[{"question": "Q", "answer": "A"}])
        self.assertEqual(response.status_code, 201)
        self.assertEqual(FlashCard.objects.count(), 1)


class QuizCheckViewTest(APITestCase):

    def setUp(self):
        self.student = make_student()
        self.course = make_course()
        self.post = Post.objects.create(
            course=self.course, student=self.student,
            title="Quiz", description="D", post_type="QUI",
        )
        self.quiz = Quiz.objects.create(post=self.post)
        self.question = Question.objects.create(quiz=self.quiz, title="¿2+2?")
        self.correct_answer = Answer.objects.create(question=self.question, text="4", is_correct=True)
        self.wrong_answer = Answer.objects.create(question=self.question, text="5", is_correct=False)

    def _check(self, responses):
        return self.client.post(
            f"/documents/{self.post.pk}/quiz/check/",
            {"responses": responses},
            format="json",
        )

    def test_correct_answer_scores_one(self):
        response = self._check([{"question": self.question.pk, "selected": [self.correct_answer.pk]}])
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data["score"], 1)
        self.assertEqual(response.data["total"], 1)

    def test_wrong_answer_scores_zero(self):
        response = self._check([{"question": self.question.pk, "selected": [self.wrong_answer.pk]}])
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data["score"], 0)

    def test_response_contains_correct_answer_ids(self):
        response = self._check([{"question": self.question.pk, "selected": [self.wrong_answer.pk]}])
        result = response.data["results"][0]
        self.assertIn(self.correct_answer.pk, result["correct_answers"])

    def test_question_from_different_quiz_returns_400(self):
        other_post = Post.objects.create(
            course=self.course, student=self.student,
            title="Other", description="D", post_type="QUI",
        )
        other_quiz = Quiz.objects.create(post=other_post)
        other_q = Question.objects.create(quiz=other_quiz, title="Q")
        Answer.objects.create(question=other_q, text="A", is_correct=True)

        response = self._check([{"question": other_q.pk, "selected": []}])
        self.assertEqual(response.status_code, 400)

    def test_check_on_nonexistent_post_returns_404(self):
        response = self.client.post(
            "/documents/9999/quiz/check/",
            {"responses": []},
            format="json",
        )
        self.assertEqual(response.status_code, 404)

    def test_check_on_non_quiz_post_returns_404(self):
        fla_post = Post.objects.create(
            course=self.course, student=self.student,
            title="Flashcard", description="D", post_type="FLA",
        )
        response = self.client.post(
            f"/documents/{fla_post.pk}/quiz/check/",
            {"responses": []},
            format="json",
        )
        self.assertEqual(response.status_code, 404)
