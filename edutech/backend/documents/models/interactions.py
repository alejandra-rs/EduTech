from django.db import models
from django.core.exceptions import ValidationError
from .post import Post


class Like(models.Model):
    post = models.ForeignKey(Post, on_delete=models.CASCADE)
    user = models.ForeignKey("users.Student", on_delete=models.CASCADE)

    def __str__(self):
        return f"{self.user} {self.post}"

    def clean(self):
        if Dislike.objects.filter(user=self.user, post=self.post).exists():
            raise ValidationError("No puedes dar like y dislike al mismo tiempo.")

    class Meta:
        unique_together = (("user", "post"),)
        indexes = [models.Index(fields=["user", "post"])]


class Dislike(models.Model):
    post = models.ForeignKey(Post, on_delete=models.CASCADE)
    user = models.ForeignKey("users.Student", on_delete=models.CASCADE)

    def __str__(self):
        return f"{self.user} {self.post}"

    def clean(self):
        if Like.objects.filter(user=self.user, post=self.post).exists():
            raise ValidationError("No puedes dar like y dislike al mismo tiempo.")

    class Meta:
        unique_together = (("user", "post"),)
        indexes = [models.Index(fields=["user", "post"])]


class Comment(models.Model):
    user = models.ForeignKey("users.Student", on_delete=models.CASCADE)
    post = models.ForeignKey(Post, on_delete=models.CASCADE)
    message = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user} {self.post}"
