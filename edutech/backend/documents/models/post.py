from django.db import models
from django.core.exceptions import ValidationError


class Post(models.Model):
    CONTENT_TYPES = (
        ("PDF", "Documento PDF"),
        ("VID", "Vídeo de YouTube"),
        ("QUI", "Cuestionario"),
        ("FLA", "Flashcards"),
    )

    course = models.ForeignKey("courses.Course", on_delete=models.CASCADE)
    student = models.ForeignKey(
        "users.Student", on_delete=models.SET_NULL, null=True, blank=True
    )

    title = models.CharField(max_length=200)
    description = models.TextField()

    post_type = models.CharField(max_length=3, choices=CONTENT_TYPES)
    views = models.PositiveIntegerField(default=0)
    is_draft = models.BooleanField(default=False)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"[{self.get_post_type_display()}] {self.title} - {self.student}"

    def clean(self):
        super().clean()
        n_contents = sum(hasattr(self, code.lower()) for code, _ in self.CONTENT_TYPES)
        if (self.pk and n_contents == 0) or n_contents > 1:
            raise ValidationError("Una publicación debe contener 1 contenido asociado.")

    class Meta:
        indexes = [
            models.Index(fields=["course", "post_type"]),
            models.Index(fields=["student"]),
        ]
