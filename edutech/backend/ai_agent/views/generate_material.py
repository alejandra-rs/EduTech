import re
import json
from ai_agent.agents_pronts import GENERATE_MATERIAL
import fitz 
from rest_framework.views import APIView
from rest_framework.response import Response


from ai_agent.agent_setings import find_documents, get_filters, get_vector_store, response_needs_code, send_prompt



class GenerateMaterial(APIView):
    def post(self, request):
        user_query = request.data.get("student_question", "")
        course_id = request.data.get("course", "").strip()
        material = request.data.get("material", "Flashcard")
        if not user_query:
            return Response({"error": "La pregunta está vacía"}, status=400)

        user_query, filtros = get_filters(user_query, course_id)

        docs = find_documents(get_vector_store(), user_query, filtros, response_needs_code(user_query))

        if not docs:
            return Response({"error": "No se encontró contexto suficiente en los documentos para generar el material."}, status=404)
        
        contexto_text = "\n\n".join([f"Fragmento {i+1}:\n{d.page_content}" for i, d in enumerate(docs)])
        
        prompt_sistema_final = f"{GENERATE_MATERIAL.get(material)}\n\nDOCUMENTACIÓN (CONTEXTO):\n{contexto_text}\n"

        json_data = json.loads(send_prompt(
        system_content= prompt_sistema_final,
        user_content=user_query,
        format="json"
        ))
        return Response({"material": json_data}, status=200)
