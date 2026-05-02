from django.db import models
from django.core.exceptions import ValidationError
from .post import Post


class Like(models.Model):
    post = models.ForeignKey(Post, on_delete=models.CASCADE)
    user = models.ForeignKey("users.Student", on_delete=models.CASCADE)

    def __str__(self):
        return f"{self.user} {self.post}"

    def save(self, *args, **kwargs):
        self.full_clean()
        super().save(*args, **kwargs)

    def clean(self):
        if Dislike.objects.filter(user_id=self.user_id, post_id=self.post_id).exists():
            raise ValidationError("No puedes dar like y dislike al mismo tiempo.")

    class Meta:
        constraints = [
            models.UniqueConstraint(fields=["post", "user"], name="unique_like")
        ]


class Dislike(models.Model):
    post = models.ForeignKey(Post, on_delete=models.CASCADE)
    user = models.ForeignKey("users.Student", on_delete=models.CASCADE)

    def __str__(self):
        return f"{self.user} {self.post}"

    def save(self, *args, **kwargs):
        self.full_clean()
        super().save(*args, **kwargs)

    def clean(self):
        if Like.objects.filter(user_id=self.user_id, post_id=self.post_id).exists():
            raise ValidationError("No puedes dar like y dislike al mismo tiempo.")

    class Meta:
        constraints = [
            models.UniqueConstraint(fields=["post", "user"], name="unique_dislike")
        ]


class Comment(models.Model):
    user = models.ForeignKey("users.Student", on_delete=models.CASCADE)
    post = models.ForeignKey(Post, on_delete=models.CASCADE)
    message = models.TextField(max_length=1000)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user} {self.post}"

    class Meta:
        indexes = [
            models.Index(fields=["post", "-created_at"]),
        ]
