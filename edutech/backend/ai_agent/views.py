import re
import json
import fitz 
from rest_framework.views import APIView
from rest_framework.response import Response


from ai_agent.agent_setings import get_vector_store, getDocument, send_prompt
from ai_agent.agents_pronts import AGENTS_PROMPTS, SYSTEM_PROMPTS


import fitz 
from documents.models import PDFAttachment 

def response_needs_code(user_query):
    """Pregunta al modelo si la consulta requiere código"""
    try:
        return json.loads(send_prompt(
                    system_content='Responde estrictamente JSON: {"code_required": bool}, el booleano será true o false en función de si el usuario pregunta o no por código',
                    user_content = user_query,
                    model="CODE_DETECT",
                    format="json"
                   )).get("code_required", False)
    except Exception as e:
        print(f"Error detectando código: {e}")
        return False


def find_documents(vector_store, query, filtros, code_required):
    """Busca y filtra documentos combinando texto y código si es necesario"""

    nomic_query = f"search_query: {query}"
    if code_required:
        brutos = vector_store.similarity_search(nomic_query, k=15, filter=filtros)
        res_code = [d for d in brutos if "CODE" in d.metadata.get("tags", [])][:4]
        res_texto = [d for d in brutos if "CODE" not in d.metadata.get("tags", [])][:6]
        return res_texto + res_code

    return vector_store.similarity_search(nomic_query, k=10, filter=filtros)

class ChatAcademicoView(APIView):
    def post(self, request):
        user_query = request.data.get("student_question", "")
        course_id = request.data.get("course", "").strip()
        modo_chat = request.data.get("mode", "estricto")
        deep_thinking = request.data.get("deep_thinking", False)

        if not user_query:
            return Response({"error": "La pregunta está vacía"}, status=400)

        user_query, filtros = self.get_filters(user_query, course_id)

        docs = find_documents(get_vector_store(), user_query, filtros, response_needs_code(user_query))

        if deep_thinking:
            respuesta_vlm = self.ejecutar_analisis_vlm_guiado(
                docs, user_query, modo_chat
            )
            if respuesta_vlm:
                return Response(respuesta_vlm)

        return self.generar_respuesta_llm(docs, user_query, modo_chat)


    def _sources_map(self, docs):
            """Asigna un ID [Ref: X] a cada documento y extrae su info clave."""
            mapa_vectores = {}
            contexto_estructurado = []
            
            for i, d in enumerate(docs):
                ref = str(i + 1)
                mapa_vectores[ref] = d
                contexto_estructurado.append({
                    "id_referencia": ref,
                    "texto": d.page_content,
                    "doc_id": d.metadata.get("doc_id"),
                    "pagina": d.metadata.get("p"),
                    "titulo": d.metadata.get("titulo", "Documento")
                })
                
            return mapa_vectores, contexto_estructurado

    def _extract_sources(self, texto_respuesta, mapa_vectores):
        """Busca etiquetas [Ref: X] en el texto y devuelve la lista de fuentes usadas."""
        ids_encontrados = set(re.findall(r"\[Ref:\s*(\d+)\]", texto_respuesta))
        fuentes = []
        
        for ref_id in ids_encontrados:
            if ref_id in mapa_vectores:
                v = mapa_vectores[ref_id]
                fuentes.append({
                    "ref": ref_id,
                    "doc_id": v.metadata.get("doc_id"),
                    "p": v.metadata.get("p"),
                    "titulo": v.metadata.get("titulo"),
                    "texto": v.page_content[:200],
                })
                
        return fuentes

    def get_filters(self, user_query, course_id):
        filtros = {"course_id": str(course_id)} if course_id else {}
        mencion = re.search(r'@"(.*?)"', user_query)
        if mencion:
            filtros["titulo"] = mencion.group(1).strip()
            user_query = user_query.replace(mencion.group(0), "").strip()
        return user_query, filtros

    def ejecutar_analisis_vlm_guiado(self, docs, user_query, modo):
        """
        Toma las 4 páginas más relevantes, las renderiza completas,
        y se las envía al modelo de visión (VLM) forzando el sistema de citas.
        """
        from documents.models import PDFAttachment

        if not docs:
            return None

        mapa_vectores, contexto_estructurado = self._sources_map(docs[:4])

        if not contexto_estructurado:
            return None

        docs_a_descargar = {}
        for c in contexto_estructurado:
            doc_id = c.get("doc_id")
            page_num = c.get("p")
            if doc_id and page_num:
                if doc_id not in docs_a_descargar:
                    docs_a_descargar[doc_id] = {"paginas": {}, "titulo": c.get("titulo", "Documento")}
                docs_a_descargar[doc_id]["paginas"][int(page_num)] = c["id_referencia"]

        image_batch = []
        image_source = []
        image_index = 1

        try:
            for doc_id, info in docs_a_descargar.items():
                pdf_instancia = PDFAttachment.objects.get(post_id=doc_id)
                doc = fitz.open(stream=getDocument(pdf_instancia)["Body"].read(), filetype="pdf")

                for page_num, ref_id in info["paginas"].items():
                    pix = doc.load_page(page_num - 1).get_pixmap(matrix=fitz.Matrix(2, 2))
                    image_batch.append(pix.tobytes("png"))
                    image_source.append(
                        f"Imagen {image_index}: [Ref: {ref_id}] del documento '{info['titulo']}', página {page_num}."
                    )
                    image_index += 1
                doc.close()

            texto_prompt_base = AGENTS_PROMPTS.get(modo, AGENTS_PROMPTS["estricto"])
            instrucciones_vision = (
                "\n\nMATERIAL ADJUNTO:\n"
                "A continuación se adjuntan imágenes. Este es el índice que relaciona su orden con su referencia:\n"
                + "\n".join(image_source) +
                "\n\nREGLA ESTRICTA: Siempre que extraigas o expliques información de una de estas imágenes, "
                "DEBES citarla obligatoriamente usando su referencia exacta (ejemplo: 'Como se ve en el gráfico [Ref: 1]...')."
                )
            prompt_sistema_final = texto_prompt_base + instrucciones_vision
            
            respuesta_texto = send_prompt(
            system_content=prompt_sistema_final,
            user_content=user_query,
            model="VISION",
            images=image_batch
            )

            fuentes_finales = self._extraer_fuentes_citadas(respuesta_texto, mapa_vectores)

            return {
                "respuesta": respuesta_texto,
                "fuentes": fuentes_finales,
            }

        except Exception as e:
            print(f"❌ Error crítico en Visión Multi-doc: {e}")
            return None

    def generar_respuesta_llm(self, docs, user_query, modo):
        """Flujo normal de ChatOllama"""

        mapa_vectores, contexto_estructurado = self._sources_map(docs)

        lista_json = [
        {"id_referencia": c["id_referencia"], "texto": c["texto"]} 
        for c in contexto_estructurado
        ]
        
        contexto_json_str = json.dumps(lista_json, ensure_ascii=False, indent=2)
        texto_prompt_base = AGENTS_PROMPTS.get(modo, AGENTS_PROMPTS["estricto"])
        prompt_sistema_final = f"{texto_prompt_base}\n\nCONTEXTO (JSON):\n{contexto_json_str}\n"

        ia_response = send_prompt(
                                    system_content=prompt_sistema_final,
                                    user_content=user_query,
                                    model="CHAT"
                                )
        sources = self._extract_sources(ia_response, mapa_vectores)

        return Response({"respuesta": ia_response, "fuentes": sources})


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
            print(f"❌ Error generating description: {e}")
            return Response({"error": "Fallo interno al generar la descripción"}, status=500)