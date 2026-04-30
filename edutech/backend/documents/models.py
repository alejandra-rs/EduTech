from django.db import models
from django.core.exceptions import ValidationError
from django.db.models.signals import post_save
from django.dispatch import receiver

MAX_PDF_KB = 600


def validate_pdf_extension(pdf):
    if not pdf.name.lower().endswith(".pdf"):
        raise ValidationError("Solo se permite la subida de archivos PDF.")


def validate_pdf_size(pdf):
    if pdf.size > MAX_PDF_KB * 1024:
        raise ValidationError(f"El tamaño del PDF no debe superar los {MAX_PDF_KB}KB.")


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


class PDFAttachment(models.Model):
    post = models.OneToOneField(Post, on_delete=models.CASCADE, related_name='pdf')
    file = models.FileField(upload_to="documents/", validators=[validate_pdf_extension, validate_pdf_size])
    ESTADOS_PROCESAMIENTO = [
            ('pendiente', 'En cola para procesar...'),
            ('subiendo', 'Subiendo fichero...'),
            ('extrayendo_txt', 'Extrayendo texto del PDF...'),
            ('reconociendo_img', 'Gemma 3: Analizando imágenes...'),
            ('vectorizando', 'Vectorizando...'),
            ('completado', '¡Listo para IA!'),
            ('error', 'Error en el procesamiento')
        ]
    processing_status = models.CharField(max_length=20, choices=ESTADOS_PROCESAMIENTO, default='subiendo')

class YoutubeVideo(models.Model):
    post = models.OneToOneField(Post, on_delete=models.CASCADE, related_name="vid")
    vid = models.URLField()


class Like(models.Model):
    post = models.ForeignKey(Post, on_delete=models.CASCADE)

    def __str__(self):
        return f"{self.user} {self.post}"

    def clean(self):
        if Dislike.objects.filter(user=self.user, post=self.post).exists():
            raise ValidationError("No puedes dar like y dislike al mismo tiempo.")

    class Meta:
        unique_together = (("user", "post"),)
        indexes = [
            models.Index(fields=["user", "post"]),
        ]

    user = models.ForeignKey("users.Student", on_delete=models.CASCADE)


class Dislike(models.Model):
    post = models.ForeignKey(Post, on_delete=models.CASCADE)

    def __str__(self):
        return f"{self.user} {self.post}"

    def clean(self):
        if Like.objects.filter(user=self.user, post=self.post).exists():
            raise ValidationError("No puedes dar like y dislike al mismo tiempo.")

    class Meta:
        unique_together = (("user", "post"),)
        indexes = [
            models.Index(fields=["user", "post"]),
        ]

    user = models.ForeignKey("users.Student", on_delete=models.CASCADE)


class Comment(models.Model):
    user = models.ForeignKey("users.Student", on_delete=models.CASCADE)
    post = models.ForeignKey(Post, on_delete=models.CASCADE)
    message = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user} {self.post}"


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


class FlashCardDeck(models.Model):
    post = models.OneToOneField(Post, on_delete=models.CASCADE, related_name="fla")


class FlashCard(models.Model):
    deck = models.ForeignKey(
        FlashCardDeck, on_delete=models.CASCADE, related_name="cards"
    )
    question = models.TextField()
    answer = models.TextField()


@receiver(post_save, sender=PDFAttachment)
def auto_vectorizar_pdf(sender, instance, created, **kwargs):
    # Si el PDF se acaba de subir por primera vez, lanzamos Celery
    if created:
        from ai_agent.tasks import procesar_pdf_y_vectorizar
        procesar_pdf_y_vectorizar.delay(instance.id)
