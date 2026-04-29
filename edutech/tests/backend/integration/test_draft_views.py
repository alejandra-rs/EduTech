from rest_framework.test import APITestCase
from documents.models import Post, FlashCardDeck, FlashCard, Quiz, Question, Answer
from ..config import make_student, make_course


DRAFT_FLA_PAYLOAD = {
    "post_type": "FLA",
    "title": "Borrador de flashcards",
    "description": "Descripción opcional",
    "cards": [
        {"question": "¿Capital de Francia?", "answer": "París"},
        {"question": "¿Capital de España?", "answer": "Madrid"},
    ],
}

DRAFT_QUI_PAYLOAD = {
    "post_type": "QUI",
    "title": "Borrador de cuestionario",
    "description": "",
    "questions": [
        {
            "title": "¿Qué es Python?",
            "answers": [
                {"text": "Un lenguaje", "is_correct": True},
                {"text": "Un animal", "is_correct": False},
            ],
        }
    ],
}


class DraftCreateFlashcardTest(APITestCase):

    def setUp(self):
        self.student = make_student()
        self.course = make_course()

    def _post(self, **overrides):
        payload = {**DRAFT_FLA_PAYLOAD, "course": self.course.pk, "student": self.student.pk}
        payload.update(overrides)
        return self.client.post("/documents/drafts/", payload, format="json")

    def test_valid_flashcard_draft_returns_201(self):
        self.assertEqual(self._post().status_code, 201)

    def test_flashcard_draft_creates_post_with_is_draft_true(self):
        self._post()
        self.assertEqual(Post.objects.count(), 1)
        self.assertTrue(Post.objects.first().is_draft)

    def test_flashcard_draft_creates_deck_and_cards(self):
        self._post()
        self.assertEqual(FlashCardDeck.objects.count(), 1)
        self.assertEqual(FlashCard.objects.count(), 2)

    def test_flashcard_draft_post_type_is_fla(self):
        self._post()
        self.assertEqual(Post.objects.first().post_type, "FLA")

    def test_flashcard_draft_does_not_appear_in_published_feed(self):
        self._post()
        response = self.client.get(f"/documents/?course={self.course.pk}")
        self.assertEqual(response.data, [])

    def test_flashcard_draft_response_shape(self):
        response = self._post()
        for key in ("id", "title", "description", "post_type", "course", "fla", "updated_at"):
            self.assertIn(key, response.data)

    def test_flashcard_draft_response_contains_nested_cards(self):
        response = self._post()
        self.assertIsNotNone(response.data["fla"])
        self.assertEqual(len(response.data["fla"]["cards"]), 2)

    def test_flashcard_draft_response_course_is_nested_object(self):
        response = self._post()
        self.assertIsInstance(response.data["course"], dict)
        self.assertEqual(response.data["course"]["id"], self.course.pk)

    def test_flashcard_draft_allows_empty_cards_list(self):
        response = self._post(cards=[])
        self.assertEqual(response.status_code, 201)
        self.assertEqual(FlashCard.objects.count(), 0)

    def test_flashcard_draft_requires_title(self):
        response = self._post(title="")
        self.assertEqual(response.status_code, 400)
        self.assertIn("title", response.data)

    def test_flashcard_draft_missing_course_returns_400(self):
        payload = {**DRAFT_FLA_PAYLOAD, "student": self.student.pk}
        response = self.client.post("/documents/drafts/", payload, format="json")
        self.assertEqual(response.status_code, 400)

    def test_flashcard_draft_missing_student_returns_400(self):
        payload = {**DRAFT_FLA_PAYLOAD, "course": self.course.pk}
        response = self.client.post("/documents/drafts/", payload, format="json")
        self.assertEqual(response.status_code, 400)

    def test_invalid_post_type_returns_400(self):
        response = self._post(post_type="PDF")
        self.assertEqual(response.status_code, 400)

    def test_no_post_created_on_missing_title(self):
        self._post(title="")
        self.assertEqual(Post.objects.count(), 0)


class DraftCreateQuizTest(APITestCase):

    def setUp(self):
        self.student = make_student()
        self.course = make_course()

    def _post(self, **overrides):
        payload = {**DRAFT_QUI_PAYLOAD, "course": self.course.pk, "student": self.student.pk}
        payload.update(overrides)
        return self.client.post("/documents/drafts/", payload, format="json")

    def test_valid_quiz_draft_returns_201(self):
        self.assertEqual(self._post().status_code, 201)

    def test_quiz_draft_creates_post_with_is_draft_true(self):
        self._post()
        self.assertTrue(Post.objects.first().is_draft)

    def test_quiz_draft_creates_quiz_questions_and_answers(self):
        self._post()
        self.assertEqual(Quiz.objects.count(), 1)
        self.assertEqual(Question.objects.count(), 1)
        self.assertEqual(Answer.objects.count(), 2)

    def test_quiz_draft_allows_empty_questions_list(self):
        response = self._post(questions=[])
        self.assertEqual(response.status_code, 201)
        self.assertEqual(Question.objects.count(), 0)

    def test_quiz_draft_allows_question_with_no_correct_answer(self):
        payload_questions = [{"title": "Q", "answers": [{"text": "A", "is_correct": False}]}]
        response = self._post(questions=payload_questions)
        self.assertEqual(response.status_code, 201)

    def test_quiz_draft_allows_question_with_empty_answers(self):
        response = self._post(questions=[{"title": "Q sin respuestas", "answers": []}])
        self.assertEqual(response.status_code, 201)

    def test_quiz_draft_does_not_appear_in_published_feed(self):
        self._post()
        response = self.client.get(f"/documents/?course={self.course.pk}")
        self.assertEqual(response.data, [])

    def test_quiz_draft_response_contains_nested_questions(self):
        response = self._post()
        self.assertIsNotNone(response.data["qui"])
        self.assertEqual(len(response.data["qui"]["questions"]), 1)

    def test_quiz_draft_requires_title(self):
        self.assertEqual(self._post(title="").status_code, 400)



class DraftListViewTest(APITestCase):

    def setUp(self):
        self.student = make_student()
        self.course = make_course()

    def _make_fla_draft(self, student=None, title="Borrador FLA"):
        post = Post.objects.create(
            course=self.course, student=student or self.student,
            title=title, description="", post_type="FLA", is_draft=True,
        )
        FlashCardDeck.objects.create(post=post)
        return post

    def _make_qui_draft(self, student=None, title="Borrador QUI"):
        post = Post.objects.create(
            course=self.course, student=student or self.student,
            title=title, description="", post_type="QUI", is_draft=True,
        )
        Quiz.objects.create(post=post)
        return post

    def test_returns_empty_list_when_no_drafts(self):
        response = self.client.get(f"/documents/drafts/?student={self.student.pk}")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data, [])

    def test_returns_flashcard_draft_for_student(self):
        self._make_fla_draft()
        response = self.client.get(f"/documents/drafts/?student={self.student.pk}")
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]["post_type"], "FLA")

    def test_returns_quiz_draft_for_student(self):
        self._make_qui_draft()
        response = self.client.get(f"/documents/drafts/?student={self.student.pk}")
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]["post_type"], "QUI")

    def test_returns_both_types_for_student(self):
        self._make_fla_draft()
        self._make_qui_draft()
        response = self.client.get(f"/documents/drafts/?student={self.student.pk}")
        self.assertEqual(len(response.data), 2)

    def test_does_not_return_other_students_drafts(self):
        other = make_student(email="other@test.com")
        self._make_fla_draft(student=other)
        response = self.client.get(f"/documents/drafts/?student={self.student.pk}")
        self.assertEqual(response.data, [])

    def test_does_not_return_published_posts(self):
        Post.objects.create(
            course=self.course, student=self.student,
            title="Publicado", description="D", post_type="FLA", is_draft=False,
        )
        response = self.client.get(f"/documents/drafts/?student={self.student.pk}")
        self.assertEqual(response.data, [])

    def test_draft_list_response_contains_course_object(self):
        self._make_fla_draft()
        response = self.client.get(f"/documents/drafts/?student={self.student.pk}")
        self.assertIsInstance(response.data[0]["course"], dict)
        self.assertIn("name", response.data[0]["course"])

    def test_draft_list_response_contains_updated_at(self):
        self._make_fla_draft()
        response = self.client.get(f"/documents/drafts/?student={self.student.pk}")
        self.assertIn("updated_at", response.data[0])

    def test_nonexistent_student_returns_404(self):
        response = self.client.get("/documents/drafts/?student=9999")
        self.assertEqual(response.status_code, 404)

    def test_drafts_ordered_by_updated_at_descending(self):
        first = self._make_fla_draft(title="Primero")
        second = self._make_qui_draft(title="Segundo")
        second.title = "Segundo actualizado"
        second.save()
        response = self.client.get(f"/documents/drafts/?student={self.student.pk}")
        self.assertEqual(response.data[0]["id"], second.pk)


class DraftDetailGetTest(APITestCase):

    def setUp(self):
        self.student = make_student()
        self.course = make_course()
        self.draft = Post.objects.create(
            course=self.course, student=self.student,
            title="Mi borrador", description="Desc", post_type="FLA", is_draft=True,
        )
        self.deck = FlashCardDeck.objects.create(post=self.draft)
        FlashCard.objects.create(deck=self.deck, question="Q1", answer="A1")

    def test_get_existing_draft_returns_200(self):
        response = self.client.get(f"/documents/drafts/{self.draft.pk}/")
        self.assertEqual(response.status_code, 200)

    def test_get_draft_returns_correct_title(self):
        response = self.client.get(f"/documents/drafts/{self.draft.pk}/")
        self.assertEqual(response.data["title"], "Mi borrador")

    def test_get_draft_includes_nested_cards(self):
        response = self.client.get(f"/documents/drafts/{self.draft.pk}/")
        self.assertEqual(len(response.data["fla"]["cards"]), 1)
        self.assertEqual(response.data["fla"]["cards"][0]["question"], "Q1")

    def test_get_draft_includes_nested_course(self):
        response = self.client.get(f"/documents/drafts/{self.draft.pk}/")
        self.assertIsInstance(response.data["course"], dict)
        self.assertEqual(response.data["course"]["id"], self.course.pk)

    def test_get_nonexistent_draft_returns_404(self):
        self.assertEqual(self.client.get("/documents/drafts/9999/").status_code, 404)

    def test_get_published_post_via_draft_endpoint_returns_404(self):
        published = Post.objects.create(
            course=self.course, student=self.student,
            title="Publicado", description="D", post_type="FLA", is_draft=False,
        )
        self.assertEqual(self.client.get(f"/documents/drafts/{published.pk}/").status_code, 404)


class DraftDetailPatchTest(APITestCase):

    def setUp(self):
        self.student = make_student()
        self.course = make_course()
        self.draft = Post.objects.create(
            course=self.course, student=self.student,
            title="Título original", description="Desc", post_type="FLA", is_draft=True,
        )
        self.deck = FlashCardDeck.objects.create(post=self.draft)
        FlashCard.objects.create(deck=self.deck, question="Original Q", answer="Original A")

    def _patch(self, **overrides):
        payload = {
            "title": "Título actualizado",
            "description": "Nueva desc",
            "cards": [{"question": "Nueva Q", "answer": "Nueva A"}],
        }
        payload.update(overrides)
        return self.client.patch(f"/documents/drafts/{self.draft.pk}/", payload, format="json")

    def test_patch_returns_200(self):
        self.assertEqual(self._patch().status_code, 200)

    def test_patch_updates_title_and_description(self):
        self._patch()
        self.draft.refresh_from_db()
        self.assertEqual(self.draft.title, "Título actualizado")
        self.assertEqual(self.draft.description, "Nueva desc")

    def test_patch_replaces_cards(self):
        self._patch()
        self.assertEqual(FlashCard.objects.count(), 1)
        self.assertEqual(FlashCard.objects.first().question, "Nueva Q")

    def test_patch_removes_old_cards(self):
        self._patch()
        self.assertFalse(FlashCard.objects.filter(question="Original Q").exists())

    def test_patch_with_empty_cards_removes_all_cards(self):
        self._patch(cards=[])
        self.assertEqual(FlashCard.objects.count(), 0)

    def test_patch_with_multiple_new_cards(self):
        self._patch(cards=[
            {"question": "Q1", "answer": "A1"},
            {"question": "Q2", "answer": "A2"},
            {"question": "Q3", "answer": "A3"},
        ])
        self.assertEqual(FlashCard.objects.count(), 3)

    def test_patch_requires_title(self):
        response = self._patch(title="")
        self.assertEqual(response.status_code, 400)

    def test_patch_keeps_is_draft_true(self):
        self._patch()
        self.assertTrue(Post.objects.get(pk=self.draft.pk).is_draft)

    def test_patch_nonexistent_draft_returns_404(self):
        response = self.client.patch("/documents/drafts/9999/", {}, format="json")
        self.assertEqual(response.status_code, 404)

    def test_patch_published_post_via_draft_endpoint_returns_404(self):
        published = Post.objects.create(
            course=self.course, student=self.student,
            title="Publicado", description="D", post_type="FLA", is_draft=False,
        )
        FlashCardDeck.objects.create(post=published)
        response = self.client.patch(f"/documents/drafts/{published.pk}/", {"title": "X", "description": ""}, format="json")
        self.assertEqual(response.status_code, 404)

    def test_patch_response_shape(self):
        response = self._patch()
        for key in ("id", "title", "description", "post_type", "course", "fla", "updated_at"):
            self.assertIn(key, response.data)


class DraftDetailPatchQuizTest(APITestCase):

    def setUp(self):
        self.student = make_student()
        self.course = make_course()
        self.draft = Post.objects.create(
            course=self.course, student=self.student,
            title="Borrador quiz", description="", post_type="QUI", is_draft=True,
        )
        quiz = Quiz.objects.create(post=self.draft)
        q = Question.objects.create(quiz=quiz, title="Q original")
        Answer.objects.create(question=q, text="A", is_correct=True)

    def _patch(self, **overrides):
        payload = {
            "title": "Quiz actualizado",
            "description": "",
            "questions": [
                {"title": "Q nueva", "answers": [{"text": "Correcta", "is_correct": True}, {"text": "Incorrecta", "is_correct": False}]},
            ],
        }
        payload.update(overrides)
        return self.client.patch(f"/documents/drafts/{self.draft.pk}/", payload, format="json")

    def test_patch_quiz_returns_200(self):
        self.assertEqual(self._patch().status_code, 200)

    def test_patch_replaces_questions(self):
        self._patch()
        self.assertEqual(Question.objects.count(), 1)
        self.assertEqual(Question.objects.first().title, "Q nueva")

    def test_patch_removes_old_questions(self):
        self._patch()
        self.assertFalse(Question.objects.filter(title="Q original").exists())

    def test_patch_replaces_answers(self):
        self._patch()
        self.assertEqual(Answer.objects.count(), 2)

    def test_patch_with_empty_questions_removes_all(self):
        self._patch(questions=[])
        self.assertEqual(Question.objects.count(), 0)
        self.assertEqual(Answer.objects.count(), 0)


class DraftDeleteTest(APITestCase):

    def setUp(self):
        self.student = make_student()
        self.course = make_course()
        self.draft = Post.objects.create(
            course=self.course, student=self.student,
            title="A borrar", description="", post_type="FLA", is_draft=True,
        )
        deck = FlashCardDeck.objects.create(post=self.draft)
        FlashCard.objects.create(deck=deck, question="Q", answer="A")

    def test_delete_returns_204(self):
        response = self.client.delete(f"/documents/drafts/{self.draft.pk}/")
        self.assertEqual(response.status_code, 204)

    def test_delete_removes_post(self):
        self.client.delete(f"/documents/drafts/{self.draft.pk}/")
        self.assertEqual(Post.objects.count(), 0)

    def test_delete_cascades_to_deck_and_cards(self):
        self.client.delete(f"/documents/drafts/{self.draft.pk}/")
        self.assertEqual(FlashCardDeck.objects.count(), 0)
        self.assertEqual(FlashCard.objects.count(), 0)

    def test_delete_nonexistent_draft_returns_404(self):
        self.assertEqual(self.client.delete("/documents/drafts/9999/").status_code, 404)

    def test_delete_published_post_via_draft_endpoint_returns_404(self):
        published = Post.objects.create(
            course=self.course, student=self.student,
            title="Publicado", description="D", post_type="FLA", is_draft=False,
        )
        response = self.client.delete(f"/documents/drafts/{published.pk}/")
        self.assertEqual(response.status_code, 404)
        self.assertTrue(Post.objects.filter(pk=published.pk).exists())



class PostListExcludesDraftsTest(APITestCase):

    def setUp(self):
        self.student = make_student()
        self.course = make_course()

    def _make_published_fla(self):
        post = Post.objects.create(
            course=self.course, student=self.student,
            title="Publicado", description="D", post_type="FLA", is_draft=False,
        )
        FlashCardDeck.objects.create(post=post)
        return post

    def _make_draft_fla(self):
        post = Post.objects.create(
            course=self.course, student=self.student,
            title="Borrador", description="D", post_type="FLA", is_draft=True,
        )
        FlashCardDeck.objects.create(post=post)
        return post

    def test_published_feed_excludes_drafts(self):
        self._make_draft_fla()
        response = self.client.get(f"/documents/?course={self.course.pk}")
        self.assertEqual(len(response.data), 0)

    def test_published_feed_includes_published_posts(self):
        self._make_published_fla()
        response = self.client.get(f"/documents/?course={self.course.pk}")
        self.assertEqual(len(response.data), 1)

    def test_published_feed_excludes_drafts_when_mixed(self):
        self._make_published_fla()
        self._make_draft_fla()
        response = self.client.get(f"/documents/?course={self.course.pk}")
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]["title"], "Publicado")

    def test_draft_not_accessible_via_post_detail_endpoint(self):
        draft = self._make_draft_fla()
        response = self.client.get(f"/documents/{draft.pk}")
        list_response = self.client.get(f"/documents/?course={self.course.pk}")
        ids = [p["id"] for p in list_response.data]
        self.assertNotIn(draft.pk, ids)
