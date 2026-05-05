import os
import re
import json
import fitz  # PyMuPDF
import boto3
from rest_framework.views import APIView
from rest_framework.response import Response
from django.conf import settings
from ollama import Client as OllamaClient

from langchain_ollama import OllamaEmbeddings, ChatOllama
from langchain_postgres.vectorstores import PGVector
from langchain_core.prompts import ChatPromptTemplate


SYSTEM_PROMPTS = {
            "ejercicios":
                                """Eres un tutor académico experto en crear prácticas. Tu objetivo es generar ejercicios basándote EXCLUSIVAMENTE en el contexto proporcionado.

                                    REGLAS INQUEBRANTABLES:
                                    1. BASADO EN EL CONTEXTO: Usa la estructura de los ejercicios o conceptos del contexto, pero CAMBIA los datos o variables para crear un reto nuevo.
                                    2. CITAS (Solo texto): SIEMPRE que citas un fragmento con id_referencia, incluye la referencia[Ref: X].
                                    3. NO INVENTAR: Si el contexto no tiene información suficiente para crear un ejercicio con sentido, responde: "No hay suficiente información en el material para generar un ejercicio."

                                    ESTRUCTURA ESPERADA DE TU RESPUESTA:
                                    - **Enunciado:** (El problema a resolver, referenciando un problema con la misma estructura) [Ref: X]
                                    - **Datos:** (Variables o información necesaria)

                                    FORMATO:
                                    Formatea tu respuesta utilizando Markdown (usa negritas, listas y bloques de código ``` cuando sea necesario).
                                    NUNCA olvides añadir las referencias [Ref: X].""",

            "tutor":
                    """Eres un profesor experto en simplificar conceptos complejos. Tu objetivo es explicar basándote en el contexto proporcionado.

                        REGLAS INQUEBRANTABLES:
                        1. ESTRUCTURA DE 3 PASOS: Tu respuesta DEBE tener siempre estas tres partes:
                        - CITAS (Solo texto): Cada vez que extraigas un dato con id_referencia, pon al final su número [Ref: X].
                        - EXPLICACIÓN: Explícalo con tus propias palabras manteniendo la esencia técnica.
                        - EJEMPLO COTIDIANO: Inventa una analogía con objetos o situaciones del día a día para que lo entienda un principiante.
                        2. NO ALUCINAR: Si el contexto NO contiene información sobre lo que te preguntan, di explícitamente: "No tengo suficiente información en el contexto para explicar este concepto."

                        EJEMPLO DE RESPUESTA:
                        **Concepto Original:** "El polimorfismo permite que objetos de diferentes clases respondan al mismo mensaje" [Ref: 2].
                        **Explicación:** Esto significa que podemos usar una misma instrucción para diferentes tipos de datos, y cada uno sabrá cómo reaccionar.
                        **Ejemplo Cotidiano:** Piensa en un mando de televisión y el botón "Encender". Si apuntas a la TV, se enciende la pantalla. Si apuntas a la radio, suena música. El mensaje es el mismo ("Encender"), pero cada aparato responde a su manera.

                        FORMATO:
                        Formatea tu respuesta utilizando Markdown (usa negritas, listas y bloques de código ``` cuando sea necesario).
                        NUNCA olvides añadir las referencias [Ref: X] en la parte técnica.""",
            "estricto": 
                        
                            """Eres un asistente académico MUY ESTRICTO. Tu única tarea es responder usando EXCLUSIVAMENTE el contexto proporcionado.

                            REGLAS INQUEBRANTABLES:
                            1. PROHIBIDO INVENTAR: Si la respuesta no está explícitamente en el contexto, tu única respuesta debe ser: "La información solicitada no se encuentra en el documento. Se recomienda revisar la documentación oficial o preguntar al profesor."
                            2. REGLA DE CITAS: Cada vez que extraigas un dato con id_referencia, DEBES poner al final de la oración su número de referencia, usando exactamente el formato [Ref: X].
                            3. CERO OPINIONES: No añadas saludos, ni comentarios personales, ni conclusiones que no estén en el texto.
                            
                            EJEMPLO DE RESPUESTA:
                            "El patrón Singleton asegura una instancia única [Ref: 1]. La arquitectura MVC se divide en Model, View y Controller [Ref: 4]."

                            FORMATO:
                            Formatea tu respuesta utilizando Markdown (usa negritas, listas y bloques de código ``` cuando sea necesario).
                            NUNCA olvides referenciar los fragmentos usados con [Ref: X].""",
            "esquema": 
                        """### INSTRUCCIÓN DE FORMATO TÉCNICO
                            Tu respuesta completa debe ser ÚNICAMENTE el esquema jerárquico en Markdown.
                            PROHIBIDO escribir cualquier frase introductoria, conclusión, saludo o párrafo.
                            PROHIBIDO usar oraciones. SOLO puntos de lista.
                            Tu primera línea de respuesta DEBE ser el título con ###.
                            Si escribes una sola oración que no sea un punto de lista, has fallado.

                            ### REGLAS VISUALES:
                            - Usa solo guiones (-) para los puntos.
                            - Máximo 15 palabras por línea.
                            - Obligatorio incluir [Ref: X] al final de cada línea.

                            ### JERARQUÍA REQUERIDA:
                            - ### [Título del Tema]
                            - - **Concepto Clave** [Ref: X]
                            -   - *Detalle técnico* [Ref: X]
                            -     - `Dato específico` [Ref: X]
                            """
        }

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
                {
                    "role": "system",
                    "content": 'Responde estrictamente JSON: {"pide_codigo": bool}',
                },
                {"role": "user", "content": pregunta},
            ],
            format="json",
        )
        return json.loads(res["message"]["content"]).get("pide_codigo", False)
    except Exception as e:
        print(f"Error detectando código: {e}")
        return False


def obtener_config_vector_store():
    """Configura y devuelve el almacén de vectores"""
    url_db = os.environ.get("DATABASE_URL").replace(
        "postgres://", "postgresql+psycopg://"
    )
    embeddings = OllamaEmbeddings(
        base_url=settings.AI_SETTINGS["EMBEDDING_URL"],
        model=settings.AI_SETTINGS["EMBEDDING_MODEL"],
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
        "s3",
        endpoint_url=settings.AWS_S3_ENDPOINT_URL,
        aws_access_key_id=settings.AWS_ACCESS_KEY_ID,
        aws_secret_access_key=settings.AWS_SECRET_ACCESS_KEY,
        region_name=settings.AWS_S3_REGION_NAME,
    )
    obj = s3.get_object(
        Bucket=settings.AWS_STORAGE_BUCKET_NAME, Key=pdf_instance.file.name
    )
    return obj["Body"].read()


class ChatAcademicoView(APIView):
    def post(self, request):
        pregunta_user = request.data.get("student_question", "")
        course_id = request.data.get("course", "").strip()
        modo_chat = request.data.get("mode", "estricto")
        deep_thinking = request.data.get("deep_thinking", False)

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
            respuesta_vlm = self.ejecutar_analisis_vlm_guiado(
                docs, pregunta_user, modo_chat
            )
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

        print("\n" + "=" * 50)
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
                    pix = doc_fitz.load_page(p - 1).get_pixmap(matrix=fitz.Matrix(2, 2))
                    imagenes_batch.append(pix.tobytes("png"))

                fuentes_info.append(
                    {"titulo": info["titulo"], "p": list(info["paginas"])}
                )
                doc_fitz.close()


            cliente = get_ollama_client("VISION_URL")
            
            texto_prompt_base = SYSTEM_PROMPTS.get(modo, SYSTEM_PROMPTS["estricto"])
            prompt_completo_vision = texto_prompt_base + "\n\nMATERIAL ADJUNTO:\nA continuación se adjuntan las imágenes de las páginas del documento que debes analizar."
            
            res = cliente.chat(
                model=settings.AI_SETTINGS["VISION_MODEL"],
                messages=[
                    {
                        "role": "system",
                        "content": prompt_completo_vision,
                        "images": imagenes_batch
                    },
                    {
                        "role": "user", 
                        "content": pregunta
                    },
                ],
            )


            return {
                "respuesta": res["message"]["content"],
                "fuentes": fuentes_info,
                "modo": f"profundo_{modo}",
            }

        except Exception as e:
            print(f"❌ Error crítico en Visión Multi-doc: {e}")
            return None

    def generar_respuesta_llm(self, docs, pregunta, modo):
        """Flujo normal de ChatOllama"""
        llm = ChatOllama(
            base_url=settings.AI_SETTINGS["CHAT_URL"],
            model=settings.AI_SETTINGS["CHAT_MODEL"],
            temperature=0.1,
        )


        mapa_vectores = {}
        contexto_estructurado = []
        
        for i, d in enumerate(docs):
            ref = str(i + 1)
            mapa_vectores[ref] = d
            contexto_estructurado.append({
                "id_referencia": ref,
                "texto": d.page_content
            })
        contexto_json_str = json.dumps(contexto_estructurado, ensure_ascii=False, indent=2)
        texto_prompt_base = SYSTEM_PROMPTS.get(modo, SYSTEM_PROMPTS["estricto"])
        prompt_sistema_final = texto_prompt_base + "\n\nCONTEXTO (JSON):\n{context}\n"
        plantilla = ChatPromptTemplate.from_messages([
            ("system", prompt_sistema_final),
            ("human", "{question}")
        ])

        # 4. Invocar
        respuesta = (plantilla | llm).invoke(
            {
                "context": contexto_json_str,
                "question": pregunta
            }
        )

        # 7. Mapeo de Referencias para el Frontend
        ids_encontrados = set(re.findall(r"\[Ref:\s*(\d+)\]", respuesta.content))
        fuentes = []
        for ref_id in ids_encontrados:
            if ref_id in mapa_vectores:
                v = mapa_vectores[ref_id]
                fuentes.append(
                    {
                        "ref": ref_id,
                        "doc_id": v.metadata.get("doc_id"),
                        "p": v.metadata.get("p"),
                        "titulo": v.metadata.get("titulo"),
                        "texto": v.page_content[:200],
                    }
                )

        return Response({"respuesta": respuesta.content, "fuentes": fuentes})


from rest_framework.views import APIView
from rest_framework.response import Response
from django.conf import settings
import fitz  # PyMuPDF

# Asegúrate de importar tu modelo (ajusta la ruta si es necesario)
from documents.models import PDFAttachment 

class GenerateDescriptionView(APIView):
    def post(self, request, draft_id):
        try:
            try:
                pdf_instancia = PDFAttachment.objects.get(post_id=draft_id)
            except PDFAttachment.DoesNotExist:
                return Response({"error": "No se encontró el documento"}, status=404)

            print(f"📥 Descargando PDF borrador {draft_id} desde S3...")
            pdf_bytes = descargar_pdf_s3(pdf_instancia)
            
            doc_fitz = fitz.open(stream=pdf_bytes, filetype="pdf")
            imagenes_batch = []
            
            num_paginas_a_leer = min(3, len(doc_fitz)) 
            
            for p in range(num_paginas_a_leer):
                # Usamos una matriz un poco más pequeña para que el payload sea ligero y rápido
                pix = doc_fitz.load_page(p).get_pixmap(matrix=fitz.Matrix(1.5, 1.5))
                imagenes_batch.append(pix.tobytes("png"))
                
            doc_fitz.close()

            prompt_sistema = """Eres un asistente académico experto en catalogar información. 
Tu única tarea es leer las primeras páginas de un documento adjunto y generar una descripción breve, clara y profesional sobre su contenido.

REGLAS:
1. Sé directo: No uses saludos ni introducciones (ej. "Este documento trata sobre..."). Ve al grano.
2. Longitud: Máximo 6 o 7 lineas.
3. Enfoque: Identifica la temática principal, a quién va dirigido (si se sabe) y el tipo de documento (ej. apuntes, examen, guía docente).
4 nombrar los puntos más importante que trata, tiene que ser en texto plano

"""

            # 5. Llamar al VLM (Gemma / Llama-Vision)
            print("🧠 Solicitando resumen al modelo de visión...")
            cliente = get_ollama_client("VISION_URL")
            
            res = cliente.chat(
                model=settings.AI_SETTINGS["VISION_MODEL"],
                messages=[
                    {
                        "role": "system",
                        "content": prompt_sistema,
                        "images": imagenes_batch
                    },
                    {
                        "role": "user",
                        "content": "genera la descripción para este documento."
                    },
                ],
            )

            descripcion_generada = res["message"]["content"].strip()
            
            return Response({
                "description": descripcion_generada
            }, status=200)

        except Exception as e:
            print(f"❌ Error generando descripción con IA: {e}")
            return Response({"error": "Fallo interno al generar la descripción"}, status=500)