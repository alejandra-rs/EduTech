from django.db import models


class SavedPost(models.Model):
    folder = models.ForeignKey(
        "student_space.Folder",
        on_delete=models.CASCADE,
        related_name="saved_posts",
    )
    post = models.ForeignKey(
        "documents.Post",
        on_delete=models.CASCADE,
        related_name="saved_in",
    )
    saved_at = models.DateTimeField(auto_now_add=True)
    is_pinned = models.BooleanField(default=False, db_index=True)
    pinned_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=["folder", "post"], name="unique_post_per_folder"
            )
        ]
        indexes = [models.Index(fields=["folder", "-saved_at"])]

    def __str__(self):
        return f"{self.post} in {self.folder}"
