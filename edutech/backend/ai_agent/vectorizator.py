import fitz
from langchain_core.documents import Document as LangchainDocument
from sqlalchemy import create_engine, text
from langchain_text_splitters import RecursiveCharacterTextSplitter
from documents.models import PDFAttachment

from ai_agent.agent_setings import CONNECTION_STRING, get_vector_store, getDocument, send_prompt
from ai_agent.agents_pronts import SYSTEM_PROMPTS
from .etiquetator import generar_etiquetas


def descript_image(imagen_bytes, titulo, asignatura, descripcion, page_text=""):
    """Describe la imagen usando el contexto del documento para mayor precisión"""
    try:

        context_input = (
            f"Contexto Académico:\n"
            f"- Asignatura: {asignatura}\n"
            f"- Título del documento: {titulo}\n"
            f"- Descripción del material: {descripcion}\n"
        )
        if page_text:
            context_input += f"- Texto de la página: {page_text}\n"
        
        system_content = f"{SYSTEM_PROMPTS['trascript_image']}\n\nLa imagen se encuentra en:\n{context_input}"
        user_content = "Tarea: Describe o transcribe fielmente lo que hay en esta imagen en ESPAÑOL."

        return send_prompt(
            system_content=system_content,
            user_content=user_content,
            model="VISION",
            images=[imagen_bytes]
        )

    except Exception as e:
        return f"[Error visión: {e}]"
    

def vectorize_new_document(pdfAttachment, notify_fn=None):
    curse_name = pdfAttachment.post.course.name
    doc_title = pdfAttachment.post.title
    doc_description = pdfAttachment.post.description
    doc_id = pdfAttachment.post.id
    raw_fragments = []
    vector_store = get_vector_store()
    doc = None
    document_to_save = []

    try:


        doc = fitz.open(stream=getDocument(pdfAttachment)["Body"].read(), filetype="pdf")

        pdfAttachment.processing_status = PDFAttachment.ProcessingStages.EXTRACTING_INFORMATION
        pdfAttachment.save(update_fields=["processing_status"])
        notify_fn(pdfAttachment.processing_status.value)
        for num_pag, pagina in enumerate(doc):
            texto = pagina.get_text("text").replace("\x00", " ").strip()

            if texto:
                raw_fragments.append(
                    LangchainDocument(
                        page_content=f"search_document: {texto}",
                        metadata={"p": num_pag + 1, "tipo": "chunk"}
                    )
                )

            if len(texto) < 50:
                pix = pagina.get_pixmap(matrix=fitz.Matrix(1.5, 1.5))
                img_bytes = pix.tobytes("png")
                description = descript_image(
                    imagen_bytes=img_bytes, titulo=doc_title, asignatura=curse_name, descripcion=doc_description
                )
                if description:
                    raw_fragments.append(
                        LangchainDocument(
                            page_content=f"search_document: [Descripción visual página {num_pag + 1}]:\n{description}",
                            metadata={"p": num_pag + 1, "tipo": "vision_chunk_forced"},
                        )
                    )
                continue

            else:
                for img in pagina.get_images():
                    pix = fitz.Pixmap(doc, img[0])
                    if pix.width < 100 and pix.height < 100:
                        continue
                    if pix.n - pix.alpha > 3:
                        pix = fitz.Pixmap(fitz.csRGB, pix)
                    img_bytes = pix.tobytes("png")
                    pix = None

                    description = descript_image(
                        imagen_bytes=img_bytes,
                        titulo=doc_title,
                        asignatura=curse_name,
                        descripcion=doc_description,
                        page_text=texto
                    )

                    if description:
                        raw_fragments.append(
                            LangchainDocument(
                                page_content=f"search_document: [Imagen/Captura página {num_pag + 1}]:\n{description}",
                                metadata={
                                            "p": num_pag + 1,
                                            "tipo": "vision_chunk",
                                        },
                            )
                        )
        
        doc.close()
        doc = None

        pdfAttachment.processing_status = pdfAttachment.ProcessingStages.VECTORIZING
        pdfAttachment.save(update_fields=["processing_status"])
        notify_fn(pdfAttachment.processing_status.value)

        text_fegments = [
            f for f in raw_fragments if f.metadata["tipo"] == "chunk"
        ]
        docs_finales_hijos = [
            f for f in raw_fragments if f.metadata["tipo"] != "chunk"
        ]

        if text_fegments:
            splitter = RecursiveCharacterTextSplitter(
                chunk_size=1000, chunk_overlap=200
            )
            docs_finales_hijos.extend(splitter.split_documents(text_fegments))

        pdfAttachment.processing_status = pdfAttachment.ProcessingStages.LABELING
        pdfAttachment.save(update_fields=["processing_status"])
        notify_fn(pdfAttachment.processing_status.value)
        for d in docs_finales_hijos:
            d.page_content = f"Documento: {doc_title}\n{d.page_content}"

            d.metadata.update(
                {
                    "doc_id": doc_id,
                    "course_id": str(pdfAttachment.post.course.id),
                    "titulo": doc_title,
                    "cita_previa": d.page_content[:80].strip(),
                }
            )

            try:
                d.metadata["tags"] = generar_etiquetas(d.page_content)
            except Exception:
                d.metadata["tags"] = []

        doc_padre = LangchainDocument(
            page_content=f"Título: {doc_title}\nDescripción: {doc_description}",
            metadata={
                "tipo": "resumen_documento",
                "doc_id": doc_id,
                "course_id": str(pdfAttachment.post.course.id),
                "titulo": doc_title,
            },
        )

        document_to_save = [doc_padre] + docs_finales_hijos
        vector_store.add_documents(document_to_save)

        pdfAttachment.processing_status = pdfAttachment.ProcessingStages.COMPLETED
        pdfAttachment.save(update_fields=["processing_status"])
        notify_fn(pdfAttachment.processing_status.value)


    finally:
        if doc is not None:
            doc.close()
        try:
            del raw_fragments
            del document_to_save
        except NameError:
            pass


def borrar_vectores_documento(post_id):
    """
    Borra los vectores asociados al ID de un PDFAttachment borrado.
    """
    engine = create_engine(CONNECTION_STRING)
    with engine.connect() as conn:
        query_delete = text("""
            DELETE FROM langchain_pg_embedding 
            WHERE cmetadata->>'doc_id' = :doc_id
        """)
        conn.execute(query_delete, {"doc_id": str(post_id)})
        conn.commit()
    engine.dispose()