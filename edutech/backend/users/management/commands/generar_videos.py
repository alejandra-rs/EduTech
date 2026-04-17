from django.core.management.base import BaseCommand
from courses.models import Course
from users.models import Student
from documents.models import Post, YoutubeVideo


class Command(BaseCommand):
    help = "Genera videos de prueba para todos los cursos existentes"

    def handle(self, *args, **options):
        self.stdout.write(
            self.style.HTTP_INFO("⏳ Conectando a la base de datos de Django...")
        )

        # 1. Obtenemos un estudiante para el campo 'student' (puede ser None si tu modelo lo permite)
        estudiante = Student.objects.first()

        # 2. Obtenemos todos los cursos
        cursos = Course.objects.all()

        if not cursos.exists():
            self.stdout.write(
                self.style.WARNING(
                    "❌ No hay cursos en la base de datos. Crea algunos primero desde el admin."
                )
            )
            return

        self.stdout.write(
            f"📚 Se encontraron {cursos.count()} cursos. Insertando vídeos..."
        )

        for curso in cursos:
            # Paso A: Creamos el Post enlazado al curso
            nuevo_post = Post.objects.create(
                course=curso,
                student=estudiante,
                title=f"Tuna pasa Clases: {curso.name}",
                description=f"Vídeo de apoyo para el curso de {curso.name}.",
                post_type="VID",
            )

            # Paso B: Creamos el YoutubeVideo enlazado al Post
            YoutubeVideo.objects.create(
                post=nuevo_post, vid="https://www.youtube.com/watch?v=UQUhqv5XKFY"
            )

            self.stdout.write(self.style.SUCCESS(f"✅ Vídeo añadido a: {curso.name}"))

        self.stdout.write(self.style.SUCCESS("\n🎉 ¡Proceso terminado con éxito!"))
