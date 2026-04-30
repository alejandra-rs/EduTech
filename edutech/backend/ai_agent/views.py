import os
import re
import json
import fitz  # PyMuPDF
import boto3
import ollama
from collections import Counter
from rest_framework.views import APIView
from rest_framework.response import Response
from django.conf import settings
from ollama import Client as OllamaClient

from langchain_ollama import OllamaEmbeddings, ChatOllama
from langchain_postgres.vectorstores import PGVector
from langchain_core.prompts import ChatPromptTemplate

def get_ollama_client(service_key):
    """Crea un cliente de Ollama basado en los settings de la URL"""
    return OllamaClient(host=settings.AI_SETTINGS.get(service_key))

def detectar_intencion_codigo(pregunta):
    """Pregunta al modelo si la consulta requiere código"""
    try:
        cliente = get_ollama_client("CODE_DETECT_URL")
        res = cliente.chat(
            model=settings.AI_SETTINGS.get("CODE_DETECT_MODEL"),
            messages=[
                {'role': 'system', 'content': 'Responde estrictamente JSON: {"pide_codigo": bool}'},
                {'role': 'user', 'content': pregunta}
            ],
            format="json"
        )
        return json.loads(res['message']['content']).get("pide_codigo", False)
    except Exception as e:
        print(f"Error detectando código: {e}")
        return False

def obtener_config_vector_store():
    """Configura y devuelve el almacén de vectores"""
    url_db = os.environ.get('DATABASE_URL').replace("postgres://", "postgresql+psycopg://")
    embeddings = OllamaEmbeddings(
        base_url=settings.AI_SETTINGS["EMBEDDING_URL"],
        model=settings.AI_SETTINGS["EMBEDDING_MODEL"]
    )
    return PGVector(
        embeddings=embeddings,
        collection_name=settings.AI_SETTINGS["VECTOR_DB_COLLECTION"],
        connection=url_db,
        use_jsonb=True,
    )

def buscar_documentos_hibridos(vector_store, query, filtros, es_codigo):
    """Busca y filtra documentos combinando texto y código si es necesario"""
    if es_codigo:
        # Traemos 15 para asegurar que tenemos suficiente variedad
        brutos = vector_store.similarity_search(query, k=15, filter=filtros)
        res_code = [d for d in brutos if "CODE" in d.metadata.get("tags", [])][:4]
        res_texto = [d for d in brutos if "CODE" not in d.metadata.get("tags", [])][:6]
        return res_texto + res_code
    
    return vector_store.similarity_search(query, k=10, filter=filtros)

def descargar_pdf_s3(pdf_instance):
    """Descarga los bytes de un PDF desde Cloudflare R2"""
    s3 = boto3.client(
        's3',
        endpoint_url=settings.AWS_S3_ENDPOINT_URL,
        aws_access_key_id=settings.AWS_ACCESS_KEY_ID,
        aws_secret_access_key=settings.AWS_SECRET_ACCESS_KEY,
        region_name=settings.AWS_S3_REGION_NAME,
    )
    obj = s3.get_object(Bucket=settings.AWS_STORAGE_BUCKET_NAME, Key=pdf_instance.file.name)
    return obj['Body'].read()


class ChatAcademicoView(APIView):
    def post(self, request):
        pregunta_user = request.data.get('student_question', '')
        course_id = request.data.get('course', '').strip()
        modo_chat = request.data.get('mode', 'estricto')
        deep_thinking = request.data.get('deep_thinking', False)

        if not pregunta_user:
            return Response({"error": "La pregunta vacía"}, status=400)
        
        vs = obtener_config_vector_store()
        es_codigo = detectar_intencion_codigo(pregunta_user)
        
        # 3. Preparar Filtros y Menciones @"Titulo"
        filtros = {"course_id": str(course_id)} if course_id else {}
        mencion = re.search(r'@"(.*?)"', pregunta_user)
        if mencion:
            filtros["titulo"] = mencion.group(1).strip()
            pregunta_user = pregunta_user.replace(mencion.group(0), "").strip()

        # 4. Búsqueda de Contexto
        docs = buscar_documentos_hibridos(vs, pregunta_user, filtros, es_codigo)

        # 5. LÓGICA DE PENSAMIENTO PROFUNDO (VLM)
        if deep_thinking:
            respuesta_vlm = self.ejecutar_analisis_vlm_guiado(docs, pregunta_user, modo_chat)
            if respuesta_vlm:
                return Response(respuesta_vlm)
            
        # 6. GENERACIÓN ESTÁNDAR (LLM)
        return self.generar_respuesta_llm(docs, pregunta_user, modo_chat)

    def ejecutar_analisis_vlm_guiado(self, docs, pregunta, modo):
        """
        Toma las 3 páginas más relevantes (pueden ser de distintos PDFs),
        las renderiza completas y se las envía a la VLM.
        """
        from documents.models import PDFAttachment
        
        if not docs:
            return None

        print("\n" + "="*50)
        print(f"🧠 [PENSAMIENTO PROFUNDO MULTI-DOC] Modo: {modo.upper()}")
        
        paginas_objetivo = []
        for d in docs[:3]:
            doc_id = d.metadata.get("doc_id")
            p = d.metadata.get("p")
            titulo = d.metadata.get("titulo", "Documento")
            if doc_id and p:
                paginas_objetivo.append((doc_id, int(p), titulo))

        if not paginas_objetivo:
            return None

        docs_a_descargar = {}
        for d_id, p_num, t in paginas_objetivo:
            if d_id not in docs_a_descargar:
                docs_a_descargar[d_id] = {"paginas": set(), "titulo": t}
            docs_a_descargar[d_id]["paginas"].add(p_num)
        # 3. Procesar y Renderizar
        imagenes_batch = []
        fuentes_info = []

        try:
            for d_id, info in docs_a_descargar.items():
                pdf_instancia = PDFAttachment.objects.get(post_id=d_id)
                print(f" -> Descargando y renderizando: {info['titulo']}")
                
                pdf_bytes = descargar_pdf_s3(pdf_instancia)
                doc_fitz = fitz.open(stream=pdf_bytes, filetype="pdf")
                
                for p in info["paginas"]:
                    pix = doc_fitz.load_page(p-1).get_pixmap(matrix=fitz.Matrix(2, 2))
                    imagenes_batch.append(pix.tobytes("png"))
                
                fuentes_info.append({
                    "titulo": info["titulo"], 
                    "p": list(info["paginas"])
                })
                doc_fitz.close()

            prompts_vision = {
                "ejercicios": "Eres un tutor académico. Analiza las imágenes adjuntas y genera un ejercicio basado en ellas.",
                "explicacion": "Eres un profesor. Explica el concepto preguntado usando las páginas visuales que te adjunto.",
                "estricto": "Asistente estricto. Responde ÚNICAMENTE basado en lo que ves en estas páginas."
            }
            
            cliente = get_ollama_client("VISION_URL")
            res = cliente.chat(
                model=settings.AI_SETTINGS["VISION_MODEL"],
                messages=[
                    {'role': 'system', 'content': prompts_vision.get(modo, prompts_vision["estricto"])},
                    {'role': 'user', 'content': pregunta, 'images': imagenes_batch}
                ]
            )
            
            return {
                "respuesta": res['message']['content'],
                "fuentes": fuentes_info,
                "modo": f"profundo_{modo}"
            }

        except Exception as e:
            print(f"❌ Error crítico en Visión Multi-doc: {e}")
            return None


    def generar_respuesta_llm(self, docs, pregunta, modo):
        """Flujo normal de ChatOllama"""
        llm = ChatOllama(
            base_url=settings.AI_SETTINGS["CHAT_URL"],
            model=settings.AI_SETTINGS["CHAT_MODEL"],
            temperature=0.1
        )
        
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
        
        contexto_str = ""
        mapa_vectores = {}
        for i, d in enumerate(docs):
            ref = str(i + 1)
            mapa_vectores[ref] = d
            contexto_str += f"--- FRAGMENTO [Ref: {ref}] ---\n{d.page_content}\n\n"

        respuesta = (prompts.get(modo, prompts["estricto"]) | llm).invoke({
            "context": contexto_str,
            "question": pregunta
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