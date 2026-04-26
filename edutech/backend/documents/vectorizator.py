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

def analizar_imagen_con_gemma(imagen_bytes):
    """Describe la imagen sin charlatanería"""
    try:
        res = ollama.chat(
            model=settings.AI_SETTINGS["VISION_MODEL"],
            messages=[
                {
                    'role': 'system',
                    'content': 'Eres un procesador de datos técnico. Tienes PROHIBIDO saludar. Responde ÚNICA Y EXCLUSIVAMENTE con la transcripción o descripción técnica de la imagen.'
                },
                {
                    'role': 'user',
                    'content': 'Describe técnica y textualmente esta imagen de apuntes universitarios.',
                    'images': [imagen_bytes]
                }
            ]
        )
        return res['message']['content'].strip()
    except Exception as e:
        return f"[Error visión: {e}]"

def ingerir_nuevo_documento(pdf_instance):
    try:
        nombre_asignatura = pdf_instance.post.course.name
        titulo_doc = pdf_instance.post.title
        descripcion_doc = pdf_instance.post.description
        doc_id = pdf_instance.post.id
        fragmentos_crudos = []

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
    
        for num_pag, pagina in enumerate(doc):
            texto = pagina.get_text("text").replace('\x00', ' ')
            if texto:
                fragmentos_crudos.append(LangchainDocument(
                    page_content=texto,
                    metadata={"p": num_pag + 1, "tipo": "chunk"} 
                ))

            for img in pagina.get_images():
                xref = img[0]
                pix = fitz.Pixmap(doc, xref)
                img_bytes = pix.tobytes("png")
                
                descripcion_visual = analizar_imagen_con_gemma(img_bytes)
                fragmentos_crudos.append(LangchainDocument(
                    page_content=f"[Imagen/Captura]: {descripcion_visual}",
                    metadata={"p": num_pag + 1, "tipo": "vision_chunk"} 
                ))

        texto_padre = f"Título del documento: {titulo_doc}\nDescripción general: {descripcion_doc}"
        doc_padre = LangchainDocument(
            page_content=texto_padre,
            metadata={
                "tipo": "resumen_documento", 
                "doc_id": doc_id,
                "asignatura": nombre_asignatura,
                "titulo": titulo_doc
            }
        )

        splitter = RecursiveCharacterTextSplitter(chunk_size=800, chunk_overlap=150)
        docs_hijos = splitter.split_documents(fragmentos_crudos)

        for d in docs_hijos:
            d.metadata["cita_previa"] = d.page_content[:80].strip() + "..."
            d.metadata["doc_id"] = doc_id
            d.metadata["asignatura"] = nombre_asignatura
            d.metadata["titulo"] = titulo_doc

        documentos_a_guardar = [doc_padre] + docs_hijos
        vector_store.add_documents(documentos_a_guardar)
        pdf_instance.processing_status = 'completado'
        pdf_instance.save(update_fields=['processing_status'])

    except Exception as e:
        print(f"Fallo crítico vectorizando PDF ID {pdf_instance.id}: {e}")
        pdf_instance.processing_status = 'error'
        pdf_instance.save(update_fields=['processing_status'])

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