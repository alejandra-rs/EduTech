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
from .etiquetator import generar_etiquetas  # Asegúrate de que estén en la misma carpeta


url_original = os.environ.get('DATABASE_URL')
CONNECTION_STRING = url_original.replace("postgres://", "postgresql+psycopg://")

embeddings = OllamaEmbeddings(
    base_url=settings.AI_SETTINGS["EMBEDDING_URL"],
    model="nomic-embed-text" 
)

vector_store = PGVector(
    embeddings=embeddings,
    collection_name=settings.AI_SETTINGS["VECTOR_DB_COLLECTION"],
    connection=CONNECTION_STRING,
    use_jsonb=True,
)

def analizar_imagen_con_gemma(imagen_bytes, titulo, asignatura, descripcion):
    """Describe la imagen usando el contexto del documento para mayor precisión"""
    try:
        # Construimos un mensaje de contexto para situar al modelo
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
    try:

        # -------------------------------------------------------------
        # NUEVO: Descargar el PDF directamente desde Cloudflare R2 (S3)
        # -------------------------------------------------------------
        print(f"☁️ Descargando '{titulo_doc}' desde Cloudflare a la RAM...") 
        
        s3 = boto3.client(
            's3',
            endpoint_url=settings.AWS_S3_ENDPOINT_URL,
            aws_access_key_id=settings.AWS_ACCESS_KEY_ID,
            aws_secret_access_key=settings.AWS_SECRET_ACCESS_KEY,
            region_name=settings.AWS_S3_REGION_NAME,
        )

        key = pdf_instance.file.name
        
        # Obtenemos el archivo de Cloudflare
        respuesta_s3 = s3.get_object(Bucket=settings.AWS_STORAGE_BUCKET_NAME, Key=key)
        
        # Leemos los bytes del archivo directamente a la memoria
        pdf_bytes = respuesta_s3['Body'].read()

        # Le pasamos los bytes a PyMuPDF
        doc = fitz.open(stream=pdf_bytes, filetype="pdf")
    
        for num_pag, pagina in enumerate(doc):
            # Procesar Texto
            texto = pagina.get_text("text").replace('\x00', ' ')
            if texto:
                fragmentos_crudos.append(LangchainDocument(
                    page_content=texto,
                    metadata={"p": num_pag + 1, "tipo": "chunk"} 
                ))

            for img in pagina.get_images():
                print(f"   👀 IA analizando imagen") 
                xref = img[0]
                pix = fitz.Pixmap(doc, xref)
                img_bytes = pix.tobytes("png")
                
                descripcion_visual = analizar_imagen_con_gemma(
                    imagen_bytes=img_bytes,
                    titulo=titulo_doc,
                    asignatura=nombre_asignatura,
                    descripcion=descripcion_doc
                )
                print(f"-> Descripción IA: {descripcion_visual}...")

                metadata_vision = {
                    "p": num_pag + 1, 
                    "tipo": "vision_chunk",
                }

                fragmentos_crudos.append(LangchainDocument(
                    page_content=f"[Imagen/Captura]:\n{descripcion_visual}",
                    metadata=metadata_vision
                ))

        # B. CREAR EL DOCUMENTO PADRE (El Resumen usando title y description de Post)
        texto_padre = f"Título del documento: {titulo_doc}\nDescripción general: {descripcion_doc}"
        doc_padre = LangchainDocument(
            page_content=texto_padre,
            metadata={
                "tipo": "resumen_documento", 
                "doc_id": doc_id,
                "course_id": str(pdf_instance.post.course.id),
                "titulo": titulo_doc
            }
        )

        # C. Splitter inteligente y asignación de metadatos a los HIJOS
        splitter = RecursiveCharacterTextSplitter(chunk_size=800, chunk_overlap=150)
        docs_hijos = splitter.split_documents(fragmentos_crudos)

        for d in docs_hijos:
            d.page_content = f"Asignatura: {nombre_asignatura} | Documento: {titulo_doc}\n{d.page_content}"
            d.metadata["cita_previa"] = d.page_content[:80].strip()
            d.metadata["doc_id"] = doc_id
            d.metadata["course_id"] = str(pdf_instance.post.course.id)
            d.metadata["titulo"] = titulo_doc
            d.metadata["tags"] = generar_etiquetas(d.page_content)
            
        # D. Guardar Padre y Hijos juntos en PGVector
        documentos_a_guardar = [doc_padre] + docs_hijos
        vector_store.add_documents(documentos_a_guardar)
        
        # Actualizamos el estado de procesamiento usando tus opciones (ESTADOS_PROCESAMIENTO)
        pdf_instance.processing_status = 'completado'
        pdf_instance.save(update_fields=['processing_status'])

    except Exception as e:
        print(f"Fallo crítico vectorizando PDF ID {pdf_instance.id}: {e}")
        pdf_instance.processing_status = 'error'
        pdf_instance.save(update_fields=['processing_status'])

    finally:
        # MEJORA: El bloque finally asegura que la memoria RAM se libere SIEMPRE, 
        # incluso si la conexión S3 falla o la IA da un error a mitad de proceso.
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