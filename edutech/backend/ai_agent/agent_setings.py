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

CONNECTION_STRING = os.environ.get("DATABASE_URL").replace(
        "postgres://", "postgresql+psycopg://"
    )

def get_vector_store():
    """Configura y devuelve el almacén de vectores"""
    
    embeddings = OllamaEmbeddings(
        base_url=settings.AI_SETTINGS["EMBEDDING_URL"],
        model=settings.AI_SETTINGS["EMBEDDING_MODEL"],
    )
    return PGVector(
        embeddings=embeddings,
        collection_name=settings.AI_SETTINGS["VECTOR_DB_COLLECTION"],
        connection=CONNECTION_STRING,
        use_jsonb=True,
    )


def getDocument(pdfAttachment):
    s3 = boto3.client(
            "s3",
            endpoint_url=settings.AWS_S3_ENDPOINT_URL,
            aws_access_key_id=settings.AWS_ACCESS_KEY_ID,
            aws_secret_access_key=settings.AWS_SECRET_ACCESS_KEY,
            region_name=settings.AWS_S3_REGION_NAME,
        )

    key = pdfAttachment.file.name
    return s3.get_object(Bucket=settings.AWS_STORAGE_BUCKET_NAME, Key=key)


def get_ollama_client(service_key):
    """Crea un cliente de Ollama basado en los settings de la URL"""
    return OllamaClient(host=settings.AI_SETTINGS.get(service_key))

def send_prompt(system_content, user_content, model="CHAT", images=None, format=None):
    url_key = f"{model}_URL"
    model_key = f"{model}_MODEL"

    cliente = get_ollama_client(url_key)
    modelo_seleccionado = settings.AI_SETTINGS[model_key]

    mensajes = [
        {"role": "system", "content": system_content},
        {"role": "user", "content": user_content}
    ]
    
    if images:
        mensajes[0]["images"] = images
    
    chat_settings = {
        "model": modelo_seleccionado,
        "messages":mensajes
        }
    
    if format:
        chat_settings["format"] = format
    
    return cliente.chat(**chat_settings)["message"]["content"].strip()


def find_documents(vector_store, query, filtros, code_required):
    """Busca y filtra documentos combinando texto y código si es necesario"""

    nomic_query = f"search_query: {query}"
    if code_required:
        brutos = vector_store.similarity_search(nomic_query, k=15, filter=filtros)
        res_code = [d for d in brutos if "CODE" in d.metadata.get("tags", [])][:4]
        res_texto = [d for d in brutos if "CODE" not in d.metadata.get("tags", [])][:6]
        return res_texto + res_code

    return vector_store.similarity_search(nomic_query, k=10, filter=filtros)


def get_filters(user_query, course_id):
    filtros = {"course_id": str(course_id)} if course_id else {}
    mencion = re.search(r'@"(.*?)"', user_query)
    if mencion:
        filtros["titulo"] = mencion.group(1).strip()
        user_query = user_query.replace(mencion.group(0), "").strip()
    return user_query, filtros




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
