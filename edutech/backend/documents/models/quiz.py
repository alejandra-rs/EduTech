from django.db import models
from .post import Post


class Quiz(models.Model):
    post = models.OneToOneField(Post, on_delete=models.CASCADE, related_name="qui")


class Question(models.Model):
    quiz = models.ForeignKey(Quiz, on_delete=models.CASCADE, related_name="questions")
    title = models.CharField(max_length=500)


class Answer(models.Model):
    question = models.ForeignKey(
        Question, on_delete=models.CASCADE, related_name="answers"
    )
    text = models.CharField(max_length=500)
    is_correct = models.BooleanField(default=False)
