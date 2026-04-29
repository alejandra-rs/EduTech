import os
import re
import json
import ollama
from rest_framework.views import APIView
from rest_framework.response import Response
from django.conf import settings
from langchain_ollama import OllamaEmbeddings, ChatOllama
from langchain_postgres.vectorstores import PGVector
from langchain_core.prompts import ChatPromptTemplate

class ChatAcademicoView(APIView):
    def post(self, request):
        pregunta_raw = request.data.get('student_question', '')
        asignatura_filtro = request.data.get('course', '').strip()
        # El frontend enviará 'estricto', 'explicacion' o 'ejercicios'
        modo_chat = request.data.get('mode', 'estricto') 

        if not pregunta_raw:
            return Response({"error": "La pregunta vacía"}, status=400)

        # 1. Configuración de Modelos y VectorStore
        url_original = os.environ.get('DATABASE_URL')
        CONNECTION_STRING = url_original.replace("postgres://", "postgresql+psycopg://")

        embeddings = OllamaEmbeddings(
            base_url=settings.AI_SETTINGS["EMBEDDING_URL"],
            model=settings.AI_SETTINGS["EMBEDDING_MODEL"]
        )
        
        llm = ChatOllama(
            base_url=settings.AI_SETTINGS["CHAT_URL"],
            model=settings.AI_SETTINGS["CHAT_MODEL"],
            temperature=0.1,
        )

        vector_store = PGVector(
            embeddings=embeddings,
            collection_name=settings.AI_SETTINGS["VECTOR_DB_COLLECTION"],
            connection=CONNECTION_STRING,
            use_jsonb=True,
        )

        # 2. TUS TRES PROMPTS ORIGINALES
        prompts = {
            "ejercicios": ChatPromptTemplate.from_messages([
                ("system", """Eres un asistente académico. Responde usando el contexto proporcionado trata de hacer referencias a los fragmentos del contexto usando el formato [Ref: X] donde X es el número de referencia del fragmento.
                 SOLICITUD DE EJERCICIOS:
                 Si te piden que hagas ejercicios, trata de seguir la estructura de los ejercicios que tengas, cambia los datos pero mantén la estructura. Y referencia la fuente original con [Ref: X].
                 CONTEXTO:
                {context}"""),
                ("human", "{question}")
            ]),
            "explicacion": ChatPromptTemplate.from_messages([
                ("system", """Eres un asistente académico. Responde usando el contexto proporcionado.
                 SOLICITUD DE EXPLICACIONES:
                 Cita textualmente el fragmento que mejor explique el concepto y referencialo usando [Ref: X], después añade un ejemplo con objetos cotidianos.
                 CONTEXTO:
                {context}"""),
                ("human", "{question}")
            ]),
            "estricto": ChatPromptTemplate.from_messages([
                ("system", """Eres un asistente académico MUY ESTRICTO. Tu única tarea es responder usando EXCLUSIVAMENTE el contexto proporcionado.
                PROHIBIDO INVENTAR. Si no está, di: "Se recomienda mirar la documentación oficial."
                CONTEXTO:
                {context}"""),
                ("human", "{question}")
            ])
        }

        # 3. Lógica de Detección de Código e Intención (Tu modelo B)
        def es_pregunta_de_codigo_con_ia(pregunta):
            try:
                res = ollama.chat(
                    model=settings.AI_SETTINGS.get("CODE_DETECT_MODEL", "llama3.2:3b"),
                    messages=[{'role': 'system', 'content': 'Responde JSON: {"pide_codigo": bool}'},
                              {'role': 'user', 'content': pregunta}],
                    format="json"
                )
                return json.loads(res['message']['content']).get("pide_codigo", False)
            except: return False

        # 4. Filtros y Menciones @"Título"
        filtros = {"asignatura": asignatura_filtro} if asignatura_filtro else {}
        pregunta_busqueda = pregunta_raw
        mencion = re.search(r'@"(.*?)"', pregunta_raw)
        if mencion:
            filtros["titulo"] = mencion.group(1).strip()
            pregunta_busqueda = pregunta_raw.replace(mencion.group(0), "").strip()

        # 5. Búsqueda Vectorial Dinámica (K=6+4 o K=10)
        if es_pregunta_de_codigo_con_ia(pregunta_busqueda):
            res_texto = vector_store.similarity_search(pregunta_busqueda, k=6, filter=filtros)
            res_code = vector_store.similarity_search(pregunta_busqueda, k=4, filter={**filtros, "tipo_contenido": "Code"})
            documentos_recuperados = res_texto + res_code
        else:
            documentos_recuperados = vector_store.similarity_search(pregunta_busqueda, k=10, filter=filtros)

        # 6. Construcción de Contexto y Respuesta
        contexto_str = ""
        mapa_vectores = {}
        for i, d in enumerate(documentos_recuperados):
            ref = str(i + 1)
            mapa_vectores[ref] = d
            contexto_str += f"--- FRAGMENTO [Ref: {ref}] ---\n{d.page_content}\n\n"

        respuesta = (prompts.get(modo_chat, prompts["estricto"]) | llm).invoke({
            "context": contexto_str,
            "question": pregunta_busqueda
        })

        # 7. Mapeo de Referencias para el Frontend
        ids_encontrados = set(re.findall(r'\[Ref:\s*(\d+)\]', respuesta.content))
        fuentes = []
        for ref_id in ids_encontrados:
            if ref_id in mapa_vectores:
                v = mapa_vectores[ref_id]
                fuentes.append({
                    "ref": ref_id,
                    "doc_id": v.metadata.get('doc_id'),
                    "p": v.metadata.get('p'),
                    "titulo": v.metadata.get('titulo'),
                    "texto": v.page_content[:200]
                })

        return Response({"respuesta": respuesta.content, "fuentes": fuentes})