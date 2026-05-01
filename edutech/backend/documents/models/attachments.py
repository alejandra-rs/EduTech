from django.db import models
from django.core.exceptions import ValidationError
from .post import Post

MAX_PDF_KB = 600


def validate_pdf_extension(pdf):
    if not pdf.name.lower().endswith(".pdf"):
        raise ValidationError("Solo se permite la subida de archivos PDF.")


def validate_pdf_size(pdf):
    if pdf.size > MAX_PDF_KB * 1024:
        raise ValidationError(f"El tamaño del PDF no debe superar los {MAX_PDF_KB}KB.")


class PDFAttachment(models.Model):
    post = models.OneToOneField(Post, on_delete=models.CASCADE, related_name="pdf")
    file = models.FileField(
        upload_to="documents/", validators=[validate_pdf_extension, validate_pdf_size]
    )


class YoutubeVideo(models.Model):
    post = models.OneToOneField(Post, on_delete=models.CASCADE, related_name="vid")
    vid = models.URLField()
