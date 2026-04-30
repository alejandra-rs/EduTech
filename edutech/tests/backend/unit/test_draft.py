from django.test import TestCase
from documents.models import Post, FlashCardDeck, FlashCard, Quiz, Question, Answer
from ..config import make_student, make_course


def make_draft(course=None, student=None, post_type="FLA", title="Borrador"):
    return Post.objects.create(
        course=course or make_course(),
        student=student or make_student(),
        title=title,
        description="",
        post_type=post_type,
        is_draft=True,
    )


class PostIsDraftFieldTest(TestCase):

    def setUp(self):
        self.course = make_course()
        self.student = make_student()

    def test_published_post_is_not_draft_by_default(self):
        post = Post.objects.create(
            course=self.course, student=self.student,
            title="Publicado", description="D", post_type="QUI",
        )
        self.assertFalse(post.is_draft)

    def test_draft_post_stores_is_draft_true(self):
        draft = make_draft(course=self.course, student=self.student)
        self.assertTrue(Post.objects.get(pk=draft.pk).is_draft)

    def test_draft_and_published_post_coexist(self):
        make_draft(course=self.course, student=self.student, post_type="FLA")
        Post.objects.create(
            course=self.course, student=self.student,
            title="Publicado", description="D", post_type="FLA",
        )
        self.assertEqual(Post.objects.filter(is_draft=True).count(), 1)
        self.assertEqual(Post.objects.filter(is_draft=False).count(), 1)

    def test_draft_updated_at_changes_on_save(self):
        draft = make_draft(course=self.course, student=self.student)
        first_updated = draft.updated_at
        draft.title = "Nuevo título"
        draft.save()
        self.assertGreaterEqual(draft.updated_at, first_updated)

    def test_draft_can_be_promoted_to_published(self):
        draft = make_draft(course=self.course, student=self.student)
        draft.is_draft = False
        draft.save()
        self.assertFalse(Post.objects.get(pk=draft.pk).is_draft)


class DraftFlashcardCascadeTest(TestCase):

    def setUp(self):
        self.draft = make_draft(post_type="FLA")
        self.deck = FlashCardDeck.objects.create(post=self.draft)
        FlashCard.objects.create(deck=self.deck, question="Q1", answer="A1")
        FlashCard.objects.create(deck=self.deck, question="Q2", answer="A2")

    def test_draft_has_deck_via_fla_accessor(self):
        self.assertEqual(self.draft.fla, self.deck)

    def test_deleting_draft_post_cascades_to_deck(self):
        self.draft.delete()
        self.assertEqual(FlashCardDeck.objects.count(), 0)

    def test_deleting_draft_post_cascades_to_cards(self):
        self.draft.delete()
        self.assertEqual(FlashCard.objects.count(), 0)

    def test_deleting_deck_cascades_to_cards(self):
        self.deck.delete()
        self.assertEqual(FlashCard.objects.count(), 0)


class DraftQuizCascadeTest(TestCase):

    def setUp(self):
        self.draft = make_draft(post_type="QUI")
        self.quiz = Quiz.objects.create(post=self.draft)
        self.question = Question.objects.create(quiz=self.quiz, title="¿Q?")
        Answer.objects.create(question=self.question, text="A", is_correct=True)
        Answer.objects.create(question=self.question, text="B", is_correct=False)

    def test_draft_has_quiz_via_qui_accessor(self):
        self.assertEqual(self.draft.qui, self.quiz)

    def test_deleting_draft_post_cascades_to_quiz(self):
        self.draft.delete()
        self.assertEqual(Quiz.objects.count(), 0)

    def test_deleting_draft_post_cascades_to_questions(self):
        self.draft.delete()
        self.assertEqual(Question.objects.count(), 0)

    def test_deleting_draft_post_cascades_to_answers(self):
        self.draft.delete()
        self.assertEqual(Answer.objects.count(), 0)
