from django.db import models
from .post import Post


class FlashCardDeck(models.Model):
    post = models.OneToOneField(Post, on_delete=models.CASCADE, related_name="fla")


class FlashCard(models.Model):
    deck = models.ForeignKey(
        FlashCardDeck, on_delete=models.CASCADE, related_name="cards"
    )
    question = models.TextField(max_length=300)
    answer = models.TextField(max_length=3000)
