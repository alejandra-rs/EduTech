import fitz 
from rest_framework.views import APIView
from rest_framework.response import Response


from ai_agent.agent_setings import getDocument, send_prompt
from ai_agent.agents_pronts import SYSTEM_PROMPTS


import fitz 
from documents.models import PDFAttachment 


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