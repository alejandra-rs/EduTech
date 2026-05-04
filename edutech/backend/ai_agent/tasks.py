from celery import shared_task
from .vectorizator import ingerir_nuevo_documento
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync


def notificar_frontend(attachment_id, status, message):
    """Función de ayuda para mandar mensajes por WebSocket usando Redis"""
    channel_layer = get_channel_layer()
    async_to_sync(channel_layer.group_send)(
        f"document_{attachment_id}",
        {"type": "document_status", "status": status, "message": message},
    )


@shared_task
def procesar_pdf_y_vectorizar(attachment_id):
    try:
        from documents.models import PDFAttachment

        pdf_instance = PDFAttachment.objects.get(id=attachment_id)
        ingerir_nuevo_documento(
            pdf_instance,
            notify_fn=lambda status, message: notificar_frontend(attachment_id, status, message),
        )
        return f"Éxito: PDF {attachment_id} vectorizado."
    except Exception as e:
        notificar_frontend(attachment_id, "error", f"Error en la IA: {str(e)}")
        return f"Error procesando PDF {attachment_id}: {str(e)}"
