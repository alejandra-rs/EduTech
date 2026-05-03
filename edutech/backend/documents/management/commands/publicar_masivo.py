# Fichero: backend/documents/management/commands/publicar_masivo.py

from django.core.management.base import BaseCommand
from documents.models import Post


class Command(BaseCommand):
    help = "Convierte publicaciones en estado borrador a públicas (is_draft=False) basándose en su tipo (post_type)."

    def add_arguments(self, parser):
        # Argumento obligatorio: El tipo de post a procesar (ej: PDF, VID, FLA, QUIZ)
        parser.add_argument(
            "tipo_post", type=str, help="El tipo de post a publicar (ej: PDF, VID, FLA)"
        )

    def handle(self, *args, **options):
        tipo_post = options["tipo_post"].upper()

        # Buscamos los posts que coinciden con el tipo y son borradores
        posts_borradores = Post.objects.filter(post_type=tipo_post, is_draft=True)
        total = posts_borradores.count()

        if total == 0:
            self.stdout.write(
                self.style.SUCCESS(
                    f'No se han encontrado borradores del tipo "{tipo_post}".'
                )
            )
            return

        self.stdout.write(
            self.style.WARNING(
                f'ATENCIÓN: Se han encontrado {total} posts en borrador del tipo "{tipo_post}".'
            )
        )

        respuesta = input(
            f"¿Estás seguro de que quieres publicar {total} borradores? (y/N): "
        )
        if respuesta.lower() != "y":
            self.stdout.write(self.style.ERROR("Operación cancelada por el usuario."))
            return

        # Realizamos el Update masivo de forma eficiente
        posts_borradores.update(is_draft=False)

        self.stdout.write(
            self.style.SUCCESS(
                f'¡Éxito! Se han publicado {total} posts del tipo "{tipo_post}".'
            )
        )
