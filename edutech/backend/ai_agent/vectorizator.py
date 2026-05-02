import fitz  # PyMuPDF
import ollama
import boto3 
from django.conf import settings
from langchain_core.documents import Document as LangchainDocument
from langchain_ollama import OllamaEmbeddings
from langchain_postgres.vectorstores import PGVector
from sqlalchemy import create_engine, text
from langchain_text_splitters import RecursiveCharacterTextSplitter
import os
from .etiquetator import generar_etiquetas  


url_original = os.environ.get('DATABASE_URL')
CONNECTION_STRING = url_original.replace("postgres://", "postgresql+psycopg://")

embeddings = OllamaEmbeddings(
    base_url=settings.AI_SETTINGS["EMBEDDING_URL"],
    model="nomic-embed-text" 
)
def get_vector_store():
    """Deferred initialization of the database connection."""
    return PGVector(
                embeddings=embeddings,
                collection_name=settings.AI_SETTINGS["VECTOR_DB_COLLECTION"],
                connection=CONNECTION_STRING,
                use_jsonb=True,
            )

def analizar_imagen_con_gemma(imagen_bytes, titulo, asignatura, descripcion):
    """Describe la imagen usando el contexto del documento para mayor precisión"""
    try:
        contexto_input = (
            f"Contexto Académico:\n"
            f"- Asignatura: {asignatura}\n"
            f"- Título del documento: {titulo}\n"
            f"- Descripción del material: {descripcion}\n"
        )

        res = ollama.chat(
            model=settings.AI_SETTINGS["VISION_MODEL"],
            messages=[
                {
                    'role': 'system',
                    'content': (
                        "Eres un transcriptor visual experto. Tu ÚNICA misión es extraer texto, si es un diagrama describir el diagramas de la imagen que recibes. "
                        "REGLAS INQUEBRANTABLES:\n"
                        "1. Responde SIEMPRE y ÚNICAMENTE en ESPAÑOL.\n"
                        "2. Describe solo lo que ves físicamente en la imagen. No inventes información.\n"
                        "3. PROHIBIDO saludar, dar introducciones o hacer comentarios. Empieza directamente con el contenido.\n"
                        "4. Si la imagen contiene código terminal o comandos, transcribe el código con la mayor precisión posible, incluyendo formato y símbolos especiales.\n"
                        "5. tu output se va a vectorizar directamente, así que no añadas nada en tu respuesta que no sea util para la vectorización. Evita palabras como 'imagen', 'foto', 'diagrama' o similares, céntrate en describir el contenido de forma clara y estructurada.\n"
                        f'la imagen está en: {contexto_input}'
                    )
                },
                {
                    'role': 'user',
                    'content': 'Tarea: Describe o transcribe fielmente lo que hay en esta imagen en ESPAÑOL.',
                    'images': [imagen_bytes]
                }
            ]
        )
        return res['message']['content'].strip()
    except Exception as e:
        return f"[Error visión: {e}]"
    
    
def ingerir_nuevo_documento(pdf_instance):
    nombre_asignatura = pdf_instance.post.course.name
    titulo_doc = pdf_instance.post.title
    descripcion_doc = pdf_instance.post.description
    doc_id = pdf_instance.post.id
    fragmentos_crudos = []
    vector_store = get_vector_store()
    doc = None
    pdf_bytes = None
    documentos_a_guardar = []

    try:

        print(f"☁️ Descargando '{titulo_doc}' desde Cloudflare a la RAM...") 
        
        s3 = boto3.client(
            's3',
            endpoint_url=settings.AWS_S3_ENDPOINT_URL,
            aws_access_key_id=settings.AWS_ACCESS_KEY_ID,
            aws_secret_access_key=settings.AWS_SECRET_ACCESS_KEY,
            region_name=settings.AWS_S3_REGION_NAME,
        )

        key = pdf_instance.file.name
        
        respuesta_s3 = s3.get_object(Bucket=settings.AWS_STORAGE_BUCKET_NAME, Key=key)
        
        pdf_bytes = respuesta_s3['Body'].read()

        doc = fitz.open(stream=pdf_bytes, filetype="pdf")
        texto_total_extraido = 0
    
        for num_pag, pagina in enumerate(doc):
            pdf_instance.processing_status = 'extrayendo_txt'
            pdf_instance.save(update_fields=['processing_status'])
            texto = pagina.get_text("text").replace('\x00', ' ').strip()
            
            if texto:
                texto_total_extraido += len(texto)
                fragmentos_crudos.append(LangchainDocument(
                    page_content=texto,
                    metadata={"p": num_pag + 1, "tipo": "chunk"} 
                ))



            pdf_instance.processing_status = 'reconociendo_img'
            pdf_instance.save(update_fields=['processing_status'])
            for img in pagina.get_images():
                xref = img[0]
                pix = fitz.Pixmap(doc, xref)
                img_bytes = pix.tobytes("png")
                
                descripcion_visual = analizar_imagen_con_gemma(
                    imagen_bytes=img_bytes,
                    titulo=titulo_doc,
                    asignatura=nombre_asignatura,
                    descripcion=descripcion_doc
                )
                print(f"-> Descripción IA: {descripcion_visual}")

                metadata_vision = {
                    "p": num_pag + 1, 
                    "tipo": "vision_chunk",
                }

                fragmentos_crudos.append(LangchainDocument(
                    page_content=f"[Imagen/Captura]:\n{descripcion_visual}",
                    metadata=metadata_vision
                ))

        if texto_total_extraido < 50 and len(fragmentos_crudos) == 0:
            print("⚠️ PDF escaneado sin texto seleccionable ni imágenes detectadas. Forzando visión global...")
            for num_pag, pagina in enumerate(doc):
                pix = pagina.get_pixmap()
                img_bytes = pix.tobytes("png")
                descripcion_visual = analizar_imagen_con_gemma(img_bytes, titulo_doc, nombre_asignatura, descripcion_doc)
                fragmentos_crudos.append(LangchainDocument(
                    page_content=f"[Página escaneada completa {num_pag + 1}]:\n{descripcion_visual}",
                    metadata={"p": num_pag + 1, "tipo": "vision_chunk_forced"}
                ))
        pdf_instance.processing_status = 'vectorizando'
        pdf_instance.save(update_fields=['processing_status'])
        texto_padre = f"TITULO: {titulo_doc}\nDESCRIPCIÓN: {descripcion_doc}"
        doc_padre = LangchainDocument(
            page_content=texto_padre,
            metadata={
                "tipo": "resumen_documento", 
                "doc_id": doc_id,
                "course_id": str(pdf_instance.post.course.id),
                "titulo": titulo_doc
            }
        )

        

        fragmentos_texto = [f for f in fragmentos_crudos if f.metadata["tipo"] == "chunk"]
        docs_finales_hijos = [f for f in fragmentos_crudos if f.metadata["tipo"] != "chunk"]

        # A. Splitter solo para los fragmentos de texto
        if fragmentos_texto:
            splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=200)
            docs_texto_split = splitter.split_documents(fragmentos_texto)
            docs_finales_hijos.extend(docs_texto_split)

        # C. Asignación de metadatos comunes a todos los hijos
        for d in docs_finales_hijos:
            d.page_content = f"Documento: {titulo_doc}\n{d.page_content}"
            
            d.metadata.update({
                "doc_id": doc_id,
                "course_id": str(pdf_instance.post.course.id),
                "titulo": titulo_doc,
                "cita_previa": d.page_content[:80].strip(),
            })
            
            
            pdf_instance.processing_status = 'etiquetando'
            pdf_instance.save(update_fields=['processing_status'])
            try:
                d.metadata["tags"] = generar_etiquetas(d.page_content)
            except Exception:
                d.metadata["tags"] = []

        # D. Crear el documento padre 
        doc_padre = LangchainDocument(
            page_content=f"Título: {titulo_doc}\nDescripción: {descripcion_doc}",
            metadata={
                "tipo": "resumen_documento", 
                "doc_id": doc_id,
                "course_id": str(pdf_instance.post.course.id),
                "titulo": titulo_doc
            }
        )

        documentos_a_guardar = [doc_padre] + docs_finales_hijos
        vector_store.add_documents(documentos_a_guardar)
        
        pdf_instance.processing_status = 'completado'
        pdf_instance.save(update_fields=['processing_status'])
    finally:
        if doc is not None:
            doc.close()
        try:
            del pdf_bytes
            del fragmentos_crudos
            del documentos_a_guardar
        except NameError:
            pass
def eliminar_vectores_documento(pdf_instance_id):
    """
    Borra los vectores asociados al ID de un PDFAttachment borrado.
    """
    engine = create_engine(CONNECTION_STRING)
    with engine.connect() as conn:
        query = text("""
            DELETE FROM langchain_pg_embedding 
            WHERE cmetadata->>'doc_id' = :doc_id
        """)
        conn.execute(query, {"doc_id": str(pdf_instance_id)})
        conn.commit()