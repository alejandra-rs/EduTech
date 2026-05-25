from django.core.management.base import BaseCommand
from documents.models import PDFAttachment
from ai_agent.vectorizator import CONNECTION_STRING

from sqlalchemy import create_engine, text


class Command(BaseCommand):
    help = (
        "Limpia la base de datos vectorial por completo y resetea el estado de los PDFs"
    )

    def handle(self, *args, **kwargs):
        self.stdout.write(
            self.style.WARNING("Iniciando protocolo de limpieza extrema... 🧹")
        )

        self.stdout.write("Borrando la memoria de la IA (Vectores antiguos)...")
        try:
            engine = create_engine(CONNECTION_STRING)
            with engine.connect() as conn:
                conn.execute(text("TRUNCATE TABLE langchain_pg_embedding CASCADE;"))
                conn.commit()
            self.stdout.write(
                self.style.SUCCESS("  -> ✓ Base de datos PGVector limpia.")
            )
        except Exception as e:
            self.stdout.write(self.style.ERROR(f"  -> Error limpiando PGVector: {e}"))
            return

        self.stdout.write("Reseteando el estado de los apuntes...")
        total_actualizados = PDFAttachment.objects.all().update(
            processing_status="pendiente"
        )

        self.stdout.write(
            self.style.SUCCESS(
                f"  -> ✓ {total_actualizados} PDFs marcados como 'pendientes'."
            )
        )

        self.stdout.write(self.style.SUCCESS("\n" + "=" * 50))
        self.stdout.write(self.style.SUCCESS("LIMPIEZA COMPLETADA"))
        self.stdout.write(self.style.SUCCESS("Ya puedes lanzar tu nuevo motor con:"))
        self.stdout.write(self.style.SUCCESS("python manage.py vectorizar_antiguos"))
        self.stdout.write(self.style.SUCCESS("=" * 50 + "\n"))
