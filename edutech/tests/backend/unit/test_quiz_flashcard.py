from django.test import TestCase
from documents.models import Post, Quiz, Question, Answer, FlashCardDeck, FlashCard
from ..config import make_student, make_course


def make_post(course=None, student=None, post_type="QUI"):
    return Post.objects.create(
        course=course or make_course(),
        student=student or make_student(),
        title="T",
        description="D",
        post_type=post_type,
    )


class QuizModelTest(TestCase):

    def setUp(self):
        self.post = make_post(post_type="QUI")
        self.quiz = Quiz.objects.create(post=self.post)

    def test_quiz_linked_to_post(self):
        self.assertEqual(self.quiz.post, self.post)

    def test_post_qui_accessor_returns_quiz(self):
        self.assertEqual(self.post.qui, self.quiz)

    def test_quiz_starts_with_no_questions(self):
        self.assertEqual(self.quiz.questions.count(), 0)

    def test_deleting_post_cascades_to_quiz(self):
        self.post.delete()
        self.assertEqual(Quiz.objects.count(), 0)


class QuestionModelTest(TestCase):

    def setUp(self):
        post = make_post(post_type="QUI")
        self.quiz = Quiz.objects.create(post=post)
        self.question = Question.objects.create(quiz=self.quiz, title="¿Qué es Python?")

    def test_question_linked_to_quiz(self):
        self.assertEqual(self.question.quiz, self.quiz)

    def test_question_appears_in_quiz_questions(self):
        self.assertIn(self.question, self.quiz.questions.all())

    def test_question_starts_with_no_answers(self):
        self.assertEqual(self.question.answers.count(), 0)

    def test_deleting_quiz_cascades_to_question(self):
        self.quiz.delete()
        self.assertEqual(Question.objects.count(), 0)


class AnswerModelTest(TestCase):

    def setUp(self):
        post = make_post(post_type="QUI")
        quiz = Quiz.objects.create(post=post)
        self.question = Question.objects.create(quiz=quiz, title="¿Qué es Python?")
        self.correct = Answer.objects.create(question=self.question, text="Un lenguaje", is_correct=True)
        self.wrong = Answer.objects.create(question=self.question, text="Un animal", is_correct=False)

    def test_correct_answer_flag(self):
        self.assertTrue(self.correct.is_correct)

    def test_wrong_answer_flag(self):
        self.assertFalse(self.wrong.is_correct)

    def test_question_has_two_answers(self):
        self.assertEqual(self.question.answers.count(), 2)

    def test_correct_answers_filter(self):
        correct_answers = self.question.answers.filter(is_correct=True)
        self.assertEqual(correct_answers.count(), 1)
        self.assertEqual(correct_answers.first(), self.correct)

    def test_deleting_question_cascades_to_answers(self):
        self.question.delete()
        self.assertEqual(Answer.objects.count(), 0)


class FlashCardDeckModelTest(TestCase):

    def setUp(self):
        self.post = make_post(post_type="FLA")
        self.deck = FlashCardDeck.objects.create(post=self.post)

    def test_deck_linked_to_post(self):
        self.assertEqual(self.deck.post, self.post)

    def test_post_fla_accessor_returns_deck(self):
        self.assertEqual(self.post.fla, self.deck)

    def test_deck_starts_with_no_cards(self):
        self.assertEqual(self.deck.cards.count(), 0)

    def test_deleting_post_cascades_to_deck(self):
        self.post.delete()
        self.assertEqual(FlashCardDeck.objects.count(), 0)


class FlashCardModelTest(TestCase):

    def setUp(self):
        post = make_post(post_type="FLA")
        self.deck = FlashCardDeck.objects.create(post=post)
        self.card = FlashCard.objects.create(
            deck=self.deck, question="¿Capital de Francia?", answer="París"
        )

    def test_card_linked_to_deck(self):
        self.assertEqual(self.card.deck, self.deck)

    def test_card_appears_in_deck_cards(self):
        self.assertIn(self.card, self.deck.cards.all())

    def test_card_question_and_answer_stored(self):
        self.assertEqual(self.card.question, "¿Capital de Francia?")
        self.assertEqual(self.card.answer, "París")

    def test_deleting_deck_cascades_to_cards(self):
        self.deck.delete()
        self.assertEqual(FlashCard.objects.count(), 0)

    def test_multiple_cards_in_deck(self):
        FlashCard.objects.create(deck=self.deck, question="Q2", answer="A2")
        self.assertEqual(self.deck.cards.count(), 2)
