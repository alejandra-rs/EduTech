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
        # Extraemos título y descripción de la publicación
        titulo_doc = getattr(pdf_instance.post, 'title', 'Sin título')
        desc_doc = getattr(pdf_instance.post, 'description', getattr(pdf_instance.post, 'content', ''))
        
        fragmentos_crudos = []

        # 1. Inyectamos la información de la publicación (Página 0)
        info_post = f"INFORMACIÓN DE LA PUBLICACIÓN:\nTítulo: {titulo_doc}\nDescripción: {desc_doc}"
        fragmentos_crudos.append(LangchainDocument(
            page_content=info_post,
            metadata={"p": 0, "tipo": "info_publicacion", "asignatura": nombre_asignatura, "titulo": titulo_doc}
        ))

        # 2. Procesamos el PDF
        doc = fitz.open(stream=pdf_instance.file.read(), filetype="pdf")
        for num_pag, pagina in enumerate(doc):
            encontrado = False
            
            # Texto
            texto = pagina.get_text("text").replace('\x00', ' ').strip()
            if texto:
                fragmentos_crudos.append(LangchainDocument(
                    page_content=texto,
                    metadata={"p": num_pag + 1, "tipo": "texto", "asignatura": nombre_asignatura, "titulo": titulo_doc}
                ))
                encontrado = True

            # Imágenes
            for img in pagina.get_images():
                encontrado = True
                xref = img[0]
                pix = fitz.Pixmap(doc, xref)
                if pix.n - pix.alpha > 3: pix = fitz.Pixmap(fitz.csRGB, pix)
                desc = analizar_imagen_con_gemma(pix.tobytes("png"))
                fragmentos_crudos.append(LangchainDocument(
                    page_content=f"[Imagen]: {desc}",
                    metadata={"p": num_pag + 1, "tipo": "vision", "asignatura": nombre_asignatura, "titulo": titulo_doc}
                ))

            # Salvavidas (Si la página parecía vacía)
            if not encontrado:
                pix_pag = pagina.get_pixmap(matrix=fitz.Matrix(2, 2))
                desc_pag = analizar_imagen_con_gemma(pix_pag.tobytes("png"))
                if len(desc_pag) > 15:
                    fragmentos_crudos.append(LangchainDocument(
                        page_content=f"[Página escaneada]: {desc_pag}",
                        metadata={"p": num_pag + 1, "tipo": "vision_salvavidas", "asignatura": nombre_asignatura, "titulo": titulo_doc}
                    ))

        # 3. Fragmentación y guardado
        splitter = RecursiveCharacterTextSplitter(chunk_size=800, chunk_overlap=150)
        docs_finales = splitter.split_documents(fragmentos_crudos)

        for d in docs_finales:
            d.metadata["cita_previa"] = d.page_content[:80].strip()
            # Aseguramos que todos tengan los metadatos de filtrado
            d.metadata["asignatura"] = nombre_asignatura
            d.metadata["titulo"] = titulo_doc

        if docs_finales:
            vector_store.add_documents(docs_finales)
        
        pdf_instance.processing_status = 'completado'
        pdf_instance.save(update_fields=['processing_status'])

    except Exception as e:
        print(f"Fallo: {e}")
        pdf_instance.processing_status = 'error'
        pdf_instance.save(update_fields=['processing_status'])