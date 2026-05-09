import os
import boto3
from django.conf import settings
from ollama import Client as OllamaClient

from langchain_ollama import OllamaEmbeddings
from langchain_postgres.vectorstores import PGVector

CONNECTION_STRING: str = ""
if os.environ.get("DATABASE_URL"):
    CONNECTION_STRING = os.environ.get("DATABASE_URL", "").replace(
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
        {"role": "user", "content": user_content},
    ]

    if images:
        mensajes[0]["images"] = images

    chat_settings = {"model": modelo_seleccionado, "messages": mensajes}

    if format:
        chat_settings["format"] = format

    return cliente.chat(**chat_settings)["message"]["content"].strip()
