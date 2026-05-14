import re
import json
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
        material = request.data.get("material", "Flashcard")
        
        if not user_query:
            return Response({"error": "La pregunta está vacía"}, status=400)

        user_query, filtros = get_filters(user_query, course_id)
        docs = find_documents(get_vector_store(), user_query, filtros, response_needs_code(user_query))

        if not docs:
            return Response({"error": "No se encontró contexto suficiente..."}, status=404)
        
        contexto_text = "\n\n".join([f"Fragmento {i+1}:\n{d.page_content}" for i, d in enumerate(docs)])
        prompt_sistema_final = f"{GENERATE_MATERIAL.get(material)}\n\nDOCUMENTACIÓN (CONTEXTO):\n{contexto_text}\n"

        json_data = json.loads(send_prompt(
            system_content= prompt_sistema_final,
            user_content=user_query,
            format="json"
        ))

        try:
            student = get_object_or_404(Student, email=request.user.email)
            course = Course.objects.get(id=course_id)
            post_type = "QUI" if material == "Quiz" else "FLA"

            nuevo_draft = Post.objects.create(
                title=user_query[:200],
                description="",
                post_type=post_type,
                course=course,
                student=student,
                is_draft=True
            )

            if post_type == "QUI":
                quiz = Quiz.objects.create(post=nuevo_draft)
                for q_data in json_data.get("questions", []):
                    question = Question.objects.create(quiz=quiz, title=q_data.get("title", ""))
                    for a_data in q_data.get("answers", []):
                        Answer.objects.create(
                            question=question,
                            text=a_data.get("text", ""),
                            is_correct=a_data.get("is_correct", False)
                        )
            
            elif post_type == "FLA":
                deck = FlashCardDeck.objects.create(post=nuevo_draft)
                for c_data in json_data.get("cards", []):
                    FlashCard.objects.create(
                        deck=deck,
                        question=c_data.get("question", ""),
                        answer=c_data.get("answer", "")
                    )

            return Response({
                "message": "Borrador creado con éxito",
                "draft_id": nuevo_draft.id,
                "type": material
            }, status=200)

        except Exception as e:
            print(f"Error guardando el borrador: {e}")
            return Response({"error": "Fallo al guardar el borrador en la base de datos."}, status=500)