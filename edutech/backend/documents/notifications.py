import logging
from django.core.mail import EmailMultiAlternatives, EmailMessage
from django.conf import settings
from courses.models import Subscription

logger = logging.getLogger(__name__)
POST_TYPE_LABELS = {
    "PDF": "Documento PDF",
    "VID": "Vídeo de YouTube",
    "QUI": "Cuestionario",
    "FLA": "Flashcards",
}


def notify_subscribers_of_new_post(post):
    subscriptions = Subscription.objects.filter(course=post.course).select_related(
        "user"
    )
    if not subscriptions.exists():
        return

    course_name = post.course.name
    post_type_label = POST_TYPE_LABELS.get(post.post_type, post.post_type)
    subject = f"Nuevo material en {course_name}: {post.title}"
    from_email = settings.DEFAULT_FROM_EMAIL

    for subscription in subscriptions:
        student = subscription.user
        recipient_name = f"{student.first_name} {student.last_name}".strip()
        text_body = (
            f"Hola {recipient_name},\n\n"
            f'Se ha publicado nuevo material en el curso "{course_name}".\n\n'
            f"Título: {post.title}\n"
            f"Tipo: {post_type_label}\n"
            f"Descripción: {post.description}\n\n"
        )
        html_body = f"""<html><body>
            <p>Hola <strong>{recipient_name}</strong>,</p>
            <p>Se ha publicado nuevo material en el curso <strong>{course_name}</strong>.</p>
            <table>
              <tr><td><strong>Título:</strong></td><td>{post.title}</td></tr>
              <tr><td><strong>Tipo:</strong></td><td>{post_type_label}</td></tr>
              <tr><td><strong>Descripción:</strong></td><td>{post.description}</td></tr>
            </table>
        </body></html>"""
        try:
            msg = EmailMultiAlternatives(
                subject, text_body, from_email, [student.email]
            )
            msg.attach_alternative(html_body, "text/html")
            msg.send()
        except Exception:
            logger.exception(
                "Failed to send notification to %s for post %s", student.email, post.pk
            )


def notify_author_of_removal(author, post_title, message, image=None):
    if not (author and author.email):
        return
    body = (
        f"Hola {author.first_name},\n\n"
        f"Tu publicación «{post_title}» ha sido revisada por nuestro equipo "
        f"y ha sido retirada de la plataforma por el siguiente motivo:\n\n"
        f"{message}\n\n"
        f"Si tienes alguna duda, contacta con soporte.\n\n"
        f"El equipo de EduTech"
    )
    try:
        email = EmailMessage(
            subject="Tu publicación ha sido eliminada de EduTech",
            body=body,
            from_email=settings.DEFAULT_FROM_EMAIL,
            to=[author.email],
        )
        if image:
            email.attach(image.name, image.read(), image.content_type)
        email.send(fail_silently=True)
    except Exception:
        logger.exception(
            "Failed to send removal notification to %s for post %s",
            author.email,
            post_title,
        )
