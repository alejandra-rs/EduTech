import re
import json
from urllib import request
import fitz 
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from documents.models import Post, Quiz, Question, Answer, FlashCardDeck, FlashCard
from users.models import Student
from courses.models import Course
from django.shortcuts import get_object_or_404 

from ai_agent.agents_pronts import GENERATE_MATERIAL
from ai_agent.agent_setings import find_documents, get_filters, get_vector_store, response_needs_code, send_prompt

class GenerateMaterial(APIView):
    permission_classes = [IsAuthenticated]
    def post(self, request):
        user_query = request.data.get("student_question", "")
        course_id = request.data.get("course", "").strip()
        material = request.data.get("material", "flashcard")
        
        if not user_query:
            return Response({"error": "La pregunta está vacía"}, status=400)

        user_query, filtros = get_filters(user_query, course_id)
        docs = find_documents(get_vector_store(), user_query, filtros, response_needs_code(user_query))

        if not docs:
            return Response({"error": "No se encontró contexto suficiente..."}, status=404)
        
        contexto_text = "\n\n".join([f"Fragmento {i+1}:\n{d.page_content}" for i, d in enumerate(docs)])
        prompt_sistema_final = f"{GENERATE_MATERIAL.get(material)}\n\nDOCUMENTACIÓN (CONTEXTO):\n{contexto_text}\n"
        print("Prompt final para generación de material:\n", prompt_sistema_final)
        json_data = json.loads(send_prompt(
            system_content= prompt_sistema_final,
            user_content=user_query,
            format="json"
        ))
        
        print(json_data)
        try:
            student = get_object_or_404(Student, email=request.user.email)
            course = Course.objects.get(id=course_id)
            post_type = "QUI" if material == "quiz" else "FLA"

            nuevo_draft = Post.objects.create(
                title=user_query[:200],
                description=user_query,
                post_type=post_type,
                course=course,
                student=student,
                is_draft=True,
                ai_gen=True
            )

            if post_type == "QUI":
                quiz = Quiz.objects.create(post=nuevo_draft)
                
                lista_preguntas = json_data.get("quiz", json_data.get("questions", []))
                
                if not lista_preguntas and ("question" in json_data or "titulo" in json_data):
                    lista_preguntas = [json_data]
                
                for q_data in lista_preguntas:
                    titulo_pregunta = q_data.get("question", q_data.get("titulo", "Pregunta sin título"))
                    question = Question.objects.create(quiz=quiz, title=titulo_pregunta)
                    
                    respuestas = q_data.get("answers", q_data.get("respuestas", q_data.get("opciones", [])))
                    
                    for a_data in respuestas:
                        Answer.objects.create(
                            question=question,
                            text=a_data.get("text", a_data.get("texto", "")),
                            is_correct=a_data.get("is_correct", a_data.get("es_correcta", False))
                        )
            
            elif post_type == "FLA":
                deck = FlashCardDeck.objects.create(post=nuevo_draft)
                
                lista_flashcards = json_data.get("flashcards", json_data.get("cards", []))
                
                if not lista_flashcards and ("question" in json_data or "pregunta" in json_data):
                    lista_flashcards = [json_data]
                
                for c_data in lista_flashcards:
                    texto_pregunta = c_data.get("question", c_data.get("pregunta", c_data.get("front", "Tarjeta sin título")))
                    texto_respuesta = c_data.get("answer", c_data.get("respuesta", c_data.get("back", "Sin respuesta")))
                    
                    FlashCard.objects.create(
                        deck=deck,
                        question=texto_pregunta,
                        answer=texto_respuesta
                    )

            return Response({
                "message": "Borrador creado con éxito",
                "draft_id": nuevo_draft.id,
                "type": material
            }, status=200)
            
        except Exception as e:
            print(f"Error guardando el borrador: {e}")
            return Response({"error": "Fallo al guardar el borrador en la base de datos."}, status=500)