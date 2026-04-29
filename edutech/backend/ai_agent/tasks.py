from celery import shared_task
from .vectorizator import ingerir_nuevo_documento

@shared_task
def procesar_pdf_y_vectorizar(attachment_id):
    """
    Recibe el ID del PDF, lo busca y lanza el script de vectorización.
    """
    try:
        from documents.models import PDFAttachment
        pdf_instance = PDFAttachment.objects.get(id=attachment_id)
        pdf_instance.processing_status = 'extrayendo_txt'
        pdf_instance.save(update_fields=['processing_status'])
        
        # Llamamos a tu mega-función de vectorizator.py
        ingerir_nuevo_documento(pdf_instance)
        
        return f"Éxito: PDF {attachment_id} vectorizado."
    except PDFAttachment.DoesNotExist:
        return f"Error: No se encontró el PDF {attachment_id}"
    except Exception as e:
        return f"Error procesando PDF {attachment_id}: {str(e)}"