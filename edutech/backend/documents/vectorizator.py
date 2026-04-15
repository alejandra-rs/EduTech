import fitz  # PyMuPDF
import ollama
from django.conf import settings
from langchain_core.documents import Document as LangchainDocument
from langchain_ollama import OllamaEmbeddings
from langchain_postgres.vectorstores import PGVector
from sqlalchemy import create_engine, text
from langchain_text_splitters import RecursiveCharacterTextSplitter
import os

url_original = os.environ.get('DATABASE_URL')
CONNECTION_STRING = url_original.replace("postgres://", "postgresql+psycopg://")

# 1. INICIALIZAR EL MODELO TRADUCTOR (Usando Nomic)
embeddings = OllamaEmbeddings(
    base_url=settings.AI_SETTINGS["EMBEDDING_URL"],
    model=settings.AI_SETTINGS["EMBEDDING_MODEL"]
)

# 2. CONECTAR CON PGVECTOR (Asegúrate de que usa la variable embeddings de arriba)
vector_store = PGVector(
    embeddings=embeddings,
    collection_name=settings.AI_SETTINGS["VECTOR_DB_COLLECTION"],
    connection=CONNECTION_STRING,
    use_jsonb=True,
)

def analizar_imagen_con_gemma(imagen_bytes):
    """Sustituye al OCR: Describe técnica y textualmente la imagen"""
    try:
        res = ollama.chat(
            model=settings.AI_SETTINGS["VISION_MODEL"], # gemma3:4b
            messages=[{
                'role': 'user',
                'content': 'Actúa como un transcriptor técnico. Si ves una terminal, transcribe los comandos. Si es un diagrama, explícalo. Sé muy preciso.',
                'images': [imagen_bytes]
            }]
        )
        return res['message']['content']
    except Exception:
        return "[Error en visión artificial]"

def ingerir_nuevo_documento(pdf_instance):
    try:
        # Recuperamos la asignatura desde el modelo de Django
        nombre_asignatura = pdf_instance.post.course.name
        
        doc = fitz.open(stream=pdf_instance.file.read(), filetype="pdf")
        fragmentos_crudos = []

        for num_pag, pagina in enumerate(doc):
            # A. Procesar Texto
            texto = pagina.get_text("text").replace('\x00', ' ')
            if texto:
                fragmentos_crudos.append(LangchainDocument(
                    page_content=texto,
                    metadata={"p": num_pag + 1, "tipo": "texto", "asignatura": nombre_asignatura}
                ))

            # B. Procesar Imágenes (Sustituye OCR)
            for img in pagina.get_images():
                xref = img[0]
                pix = fitz.Pixmap(doc, xref)
                # Convertimos a formato que Ollama entienda si es necesario
                img_bytes = pix.tobytes("png")
                
                descripcion_visual = analizar_imagen_con_gemma(img_bytes)
                fragmentos_crudos.append(LangchainDocument(
                    page_content=f"[Imagen/Captura]: {descripcion_visual}",
                    metadata={"p": num_pag + 1, "tipo": "vision", "asignatura": nombre_asignatura}
                ))

        # C. Splitter inteligente y Citas de párrafo
        splitter = RecursiveCharacterTextSplitter(chunk_size=800, chunk_overlap=150)
        docs_finales = splitter.split_documents(fragmentos_crudos)

        for i, d in enumerate(docs_finales):
            # Creamos una 'cita' del párrafo (primeras 80 letras) para que la IA la use de referencia
            d.metadata["cita_previa"] = d.page_content[:80].strip() + "..."
            # Forzamos que la asignatura esté en cada pequeño trozo
            d.metadata["asignatura"] = nombre_asignatura

        # Guardar en PGVector
        vector_store.add_documents(docs_finales)
        pdf_instance.processing_status = 'completado'
        pdf_instance.save(update_fields=['processing_status'])

    except Exception as e:
        print(f"Fallo crítico: {e}")
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
            WHERE cmetadata->>'origen_id' = :origen_id
        """)
        conn.execute(query, {"origen_id": str(pdf_instance_id)})
        conn.commit()