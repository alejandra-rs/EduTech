from django.core.management.base import BaseCommand
from documents.models import PDFAttachment
from ai_agent.vectorizator import vectorize_new_document


class Command(BaseCommand):
    help = (
        "Vectoriza todos los PDFs que ya estaban en la base de datos o que dieron error"
    )

    def handle(self, *args, **kwargs):
        pdfs_pendientes = PDFAttachment.objects.exclude(processing_status="completado")

        total = pdfs_pendientes.count()

        if total == 0:
            self.stdout.write(
                self.style.SUCCESS(
                    "¡Todo al día! No hay PDFs pendientes de vectorizar."
                )
            )
            return

        self.stdout.write(
            self.style.WARNING(
                f"Se han encontrado {total} PDFs pendientes. Iniciando..."
            )
        )

        for index, pdf in enumerate(pdfs_pendientes, start=1):
            self.stdout.write(
                f"[{index}/{total}] Procesando PDF ID: {pdf.id} (Curso: {pdf.post.course.name})..."
            )

            try:
                vectorize_new_document(pdf)
                self.stdout.write(self.style.SUCCESS("  -> ¡Vectorizado con éxito!"))
            except Exception as e:
                self.stdout.write(
                    self.style.ERROR(f"  -> Error en PDF {pdf.id}: {str(e)}")
                )

        self.stdout.write(self.style.SUCCESS("¡Proceso masivo terminado!"))
