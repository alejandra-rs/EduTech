from django.db import models
from django.core.exceptions import ValidationError
from django.db.models.signals import pre_delete
from django.dispatch import receiver
from .post import Post

MAX_PDF_KB = 600


def validate_pdf_extension(pdf):
    if not pdf.name.lower().endswith(".pdf"):
        raise ValidationError("Solo se permite la subida de archivos PDF.")


def validate_pdf_size(pdf):
    if pdf.size > MAX_PDF_KB * 1024:
        raise ValidationError(f"El tamaño del PDF no debe superar los {MAX_PDF_KB}KB.")


class PDFAttachment(models.Model):
    class ProcessingStages(models.TextChoices):
        UPLOADING = "uploading"
        PENDING = "pending"
        EXTRACTING_INFORMATION = "extracting_information"
        VECTORIZING = "vectorizing"
        LABELING = "labeling"
        COMPLETED = "completed"
        ERROR = "error"

    post = models.OneToOneField(Post, on_delete=models.CASCADE, related_name="pdf")
    file = models.FileField(
        upload_to="documents/", validators=[validate_pdf_extension, validate_pdf_size]
    )

    processing_status = models.CharField(
        max_length=50,
        choices=ProcessingStages.choices,
        default=ProcessingStages.PENDING,
    )


class YoutubeVideo(models.Model):
    post = models.OneToOneField(Post, on_delete=models.CASCADE, related_name="vid")
    vid = models.URLField()


@receiver(pre_delete, sender=Post)
def eliminar_vectores_pdf(sender, instance, **kwargs):
    """Limpia la base de datos de LangChain/PGVector antes de borrar el PDF."""
    from ai_agent.vectorizator import borrar_vectores_documento

    try:
        print(f"borrando post {instance.id} y sus vectores asociados...")
        borrar_vectores_documento(instance.id)
    except Exception as e:
        print(f"Error al borrar los vectores del PDF {instance.id}: {e}")
