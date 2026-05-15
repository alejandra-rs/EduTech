import re
import json
import fitz
from rest_framework.views import APIView
from rest_framework.response import Response


from ai_agent.agent_setings import find_documents, get_filters, get_vector_store, getDocument, response_needs_code, send_prompt
from ai_agent.agents_pronts import AGENTS_PROMPTS


import fitz 
class ChatAcademicoView(APIView):
    def post(self, request):
        user_query = request.data.get("student_question", "")
        course_id = request.data.get("course", "").strip()
        modo_chat = request.data.get("mode", "estricto")
        deep_thinking = request.data.get("deep_thinking", False)
        mentions = request.data.get("mentions", [])

        if not user_query:
            return Response({"error": "La pregunta está vacía"}, status=400)

        user_query, filtros = get_filters(user_query, course_id, mentions or None)

        docs = find_documents(
            get_vector_store(), user_query, filtros, response_needs_code(user_query)
        )

        if deep_thinking:
            respuesta_vlm = self.ejecutar_analisis_vlm_guiado(
                docs, user_query, modo_chat
            )
            if respuesta_vlm:
                return Response(respuesta_vlm)

        return self.generar_respuesta_llm(docs, user_query, modo_chat)


    def sources_map(self, docs):
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
                "titulo": d.metadata.get("titulo", "Documento"),
            }
        )
        return mapa_vectores, contexto_estructurado

    def extract_sources(self, texto_respuesta, mapa_vectores):
        """Busca etiquetas [Ref: X] en el texto y devuelve la lista de fuentes usadas."""
        ids_encontrados = set(re.findall(r"\[Ref:\s*(\d+)\]", texto_respuesta))
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

        return fuentes
  
    def ejecutar_analisis_vlm_guiado(self, docs, user_query, modo):
        """
        Toma las 4 páginas más relevantes, las renderiza completas,
        y se las envía al modelo de visión (VLM) forzando el sistema de citas.
        """
        from documents.models import PDFAttachment

        if not docs:
            return None

        mapa_vectores, contexto_estructurado = self.sources_map(docs[:4])

        if not contexto_estructurado:
            return None

        docs_a_descargar = {}
        for c in contexto_estructurado:
            doc_id = c.get("doc_id")
            page_num = c.get("p")
            if doc_id and page_num:
                if doc_id not in docs_a_descargar:
                    docs_a_descargar[doc_id] = {
                        "paginas": {},
                        "titulo": c.get("titulo", "Documento"),
                    }
                docs_a_descargar[doc_id]["paginas"][int(page_num)] = c["id_referencia"]

        image_batch = []
        image_source = []
        image_index = 1

        try:
            for doc_id, info in docs_a_descargar.items():
                pdf_instancia = PDFAttachment.objects.get(post_id=doc_id)
                doc = fitz.open(
                    stream=getDocument(pdf_instancia)["Body"].read(), filetype="pdf"
                )

                for page_num, ref_id in info["paginas"].items():
                    pix = doc.load_page(page_num - 1).get_pixmap(
                        matrix=fitz.Matrix(2, 2)
                    )
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
                + "\n".join(image_source)
                + "\n\nREGLA ESTRICTA: Siempre que extraigas o expliques información de una de estas imágenes, "
                "DEBES citarla obligatoriamente usando su referencia exacta (ejemplo: 'Como se ve en el gráfico [Ref: 1]...')."
            )
            prompt_sistema_final = texto_prompt_base + instrucciones_vision

            respuesta_texto = send_prompt(
                system_content=prompt_sistema_final,
                user_content=user_query,
                model="VISION",
                images=image_batch,
            )

            fuentes_finales = self._extraer_fuentes_citadas(
                respuesta_texto, mapa_vectores
            )

            return {
                "respuesta": respuesta_texto,
                "fuentes": fuentes_finales,
            }

        except Exception as e:
            print(f"❌ Error crítico en Visión Multi-doc: {e}")
            return None

    def generar_respuesta_llm(self, docs, user_query, modo):
        """Flujo normal de ChatOllama"""

        mapa_vectores, contexto_estructurado = self.sources_map(docs)

        lista_json = [
            {"id_referencia": c["id_referencia"], "texto": c["texto"]}
            for c in contexto_estructurado
        ]

        contexto_json_str = json.dumps(lista_json, ensure_ascii=False, indent=2)
        texto_prompt_base = AGENTS_PROMPTS.get(modo, AGENTS_PROMPTS["estricto"])
        prompt_sistema_final = (
            f"{texto_prompt_base}\n\nCONTEXTO (JSON):\n{contexto_json_str}\n"
        )

        ia_response = send_prompt(
                                    system_content=prompt_sistema_final,
                                    user_content=user_query,
                                    model="CHAT"
                                )
        sources = self.extract_sources(ia_response, mapa_vectores)

        return Response({"respuesta": ia_response, "fuentes": sources})

