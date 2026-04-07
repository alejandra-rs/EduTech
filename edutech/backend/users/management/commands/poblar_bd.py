import json
import os
from django.core.management.base import BaseCommand
from django.conf import settings

from users.models import Student
from courses.models import Course, Year, Subscription
from documents.models import Post, PDFAttachment, YoutubeVideo, Like, Dislike, Comment

class Command(BaseCommand):
    help = 'Puebla la BD completa con interacciones y suscripciones'

    def handle(self, *args, **kwargs):
        ruta_json = os.path.join(settings.BASE_DIR, 'db.json')

        with open(ruta_json, 'r', encoding='utf-8') as file:
            datos = json.load(file)

            # 1. Años y Estudiantes
            for y in datos.get('years', []): 
                Year.objects.get_or_create(year=y['year'])
                
            for s in datos.get('students', []):
                Student.objects.get_or_create(email=s['email'], defaults={
                    'first_name': s['first_name'], 'last_name': s['last_name'], 'password': s['password']
                })
            self.stdout.write(self.style.SUCCESS('✅ Usuarios creados.'))

            # 2. Cursos
            for c in datos.get('courses', []):
                y_obj = Year.objects.get(year=c['year'])
                Course.objects.get_or_create(name=c['name'], year=y_obj, semester=c['semester'])
            self.stdout.write(self.style.SUCCESS('✅ Cursos creados.'))

            # 2.5. SUSCRIPCIONES (¡El bloque que faltaba!)
            for sub_data in datos.get('subscriptions', []):
                try:
                    user = Student.objects.get(email=sub_data['user_email'])
                    course = Course.objects.get(name=sub_data['course_name'])
                    Subscription.objects.get_or_create(user=user, course=course)
                except (Student.DoesNotExist, Course.DoesNotExist):
                    continue
            self.stdout.write(self.style.SUCCESS('✅ Suscripciones asignadas.'))

            # 3. Posts y Contenidos (con mapeo de IDs)
            post_map = {} 
            for p_data in datos.get('posts', []):
                try:
                    user = Student.objects.get(email=p_data['student_email'])
                    course = Course.objects.get(name=p_data['course_name'])

                    post, created = Post.objects.get_or_create(
                        title=p_data['title'],
                        course=course,
                        student=user,
                        defaults={'description': p_data['description'], 'post_type': p_data['post_type']}
                    )
                    
                    post_map[p_data['id']] = post

                    if p_data['post_type'] == 'PDF':
                        PDFAttachment.objects.get_or_create(post=post, defaults={'file': p_data['content_url']})
                    elif p_data['post_type'] == 'VID':
                        YoutubeVideo.objects.get_or_create(post=post, defaults={'vid': p_data['content_url']})

                except Exception as e:
                    self.stdout.write(self.style.WARNING(f"⚠️ Error en post {p_data['title']}: {e}"))
            self.stdout.write(self.style.SUCCESS('✅ Posts y adjuntos cargados.'))

            # 4. Likes y Dislikes
            for l_data in datos.get('likes', []):
                user = Student.objects.get(email=l_data['student_email'])
                post = post_map.get(l_data['post_id'])
                if post: Like.objects.get_or_create(user=user, post=post)
                
            for d_data in datos.get('dislikes', []):
                user = Student.objects.get(email=d_data['student_email'])
                post = post_map.get(d_data['post_id'])
                if post: Dislike.objects.get_or_create(user=user, post=post)
            self.stdout.write(self.style.SUCCESS('✅ Likes y Dislikes cargados.'))

            # 5. Comentarios
            for c_data in datos.get('comments', []):
                user = Student.objects.get(email=c_data['student_email'])
                post = post_map.get(c_data['post_id'])
                if post:
                    Comment.objects.get_or_create(user=user, post=post, message=c_data['message'])
            self.stdout.write(self.style.SUCCESS('✅ Comentarios cargados.'))

            self.stdout.write(self.style.SUCCESS('\n🚀 ¡Población masiva completada con éxito!'))