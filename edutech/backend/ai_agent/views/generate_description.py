import json
import pymupdf4llm
from rest_framework.views import APIView
from rest_framework.response import Response


from ai_agent.agent_setings import getDocument, send_prompt
from ai_agent.agents_pronts import SYSTEM_PROMPTS


import fitz 
from documents.models import PDFAttachment, PDFRevisionNote


class GenerateDescriptionView(APIView):
    def post(self, request, draft_id):
        try:
            try:
                pdf_attachment = PDFAttachment.objects.get(post_id=draft_id)
            except PDFAttachment.DoesNotExist:
                return Response({"error": "No se encontró el documento"}, status=404)
            
            pdf_document = fitz.open(stream=getDocument(pdf_attachment)["Body"].read(), filetype="pdf")
            
            image_batch = []
            
            for page_num in range(min(3, len(pdf_document))):
                pixmap = pdf_document.load_page(page_num).get_pixmap(matrix=fitz.Matrix(1.5, 1.5))
                image_batch.append(pixmap.tobytes("png"))
                
            pdf_document.close()

            generated_description = send_prompt(
                system_content=SYSTEM_PROMPTS["generate_description"],
                user_content="Genera descripción para este documento.",
                model="VISION",
                images=image_batch
            )
            
            return Response({
                "description": generated_description
            }, status=200)

        except Exception as e:
            print(f"Error generating description: {e}")
            return Response({"error": "Fallo interno al generar la descripción"}, status=500)
        
    
class ValidateDocument(APIView):
    def post(self, request, draft_id):
        try:
            try:
                pdf_attachment = PDFAttachment.objects.get(post_id=draft_id)
            except PDFAttachment.DoesNotExist:
                return Response({"error": "No se encontró el documento"}, status=404)
            
            pdf_stream = getDocument(pdf_attachment)["Body"].read()
            pdf_document = fitz.open(stream=pdf_stream, filetype="pdf")
            
            texto_pdf_markdown = pymupdf4llm.to_markdown(pdf_document)
            text_status =  json.loads(send_prompt(
                system_content=SYSTEM_PROMPTS["validate_document"] + "TEXTO A ANALIZAR:\n" + texto_pdf_markdown,
                user_content=f"Valida el siguiente texto estrictamente buscando insultos o lenguaje de odio:\n\n{texto_pdf_markdown}",
                format="json"
            ))
               
            if not text_status.get("status", True):
                pdf_document.close()
                return self.enviar_a_revision(pdf_attachment, text_status.get("reason", "Contenido de texto inapropiado"))

            image_batch = []
            
            for page_num in range(len(pdf_document)):
                page = pdf_document.load_page(page_num)
                
                imagenes_en_pagina = page.get_images(full=True)
                
                for img_info in imagenes_en_pagina:
                    xref = img_info[0]
                    imagen_extraida = pdf_document.extract_image(xref)
                    image_bytes = imagen_extraida["image"]
                    
                    image_batch.append(image_bytes)
                
            pdf_document.close()

            if not image_batch:
                return Response({"status": True, "reason": None}, status=200)

            status_imagenes = json.loads(send_prompt(
                system_content=SYSTEM_PROMPTS["validate_document"],
                user_content="Valida estrictamente estas imágenes extraídas del documento buscando desnudez o contenido visual inapropiado.",
                model="VISION",
                images=image_batch,
                format="json"
            ))

            if not status_imagenes.get("status", True):
                return self.enviar_a_revision(pdf_attachment, status_imagenes.get("reason", "Contenido visual inapropiado"))

            return Response({"status": True, "reason": None}, status=200)
        except Exception as e:
            print(f"Error generating description: {e}")
            return Response({"error": "Fallo interno al validar el documento"}, status=500)
        


    def enviar_a_revision(self, attachment, reason):
        """Crea la nota de revisión y avisa al frontend"""
        PDFRevisionNote.objects.create(
            attachment=attachment,
            reason=reason 
        )
        return Response({
            "status": False,
            "reason": f"El documento ha sido enviado a revisión manual por un administrador. por el siguiente motivo: {reason}"
        }, status=200)