import os
from django.core.management.base import BaseCommand
from django.conf import settings
from langchain_ollama import OllamaEmbeddings, ChatOllama
from langchain_postgres.vectorstores import PGVector
from langchain_core.prompts import ChatPromptTemplate
import time

class Command(BaseCommand):
    help = 'Abre un chat interactivo con modo test y cronómetro'

    def handle(self, *args, **kwargs):
        self.stdout.write(self.style.WARNING("Conectando con la base de datos y modelos..."))

        url_original = os.environ.get('DATABASE_URL')
        CONNECTION_STRING = url_original.replace("postgres://", "postgresql+psycopg://")

        embeddings = OllamaEmbeddings(
            base_url=settings.AI_SETTINGS["EMBEDDING_URL"],
            model=settings.AI_SETTINGS["EMBEDDING_MODEL"]
        )
        
        llm = ChatOllama(
            base_url=settings.AI_SETTINGS["CHAT_URL"],
            model=settings.AI_SETTINGS["CHAT_MODEL"],
            temperature=0.2 
        )

        vector_store = PGVector(
            embeddings=embeddings,
            collection_name=settings.AI_SETTINGS["VECTOR_DB_COLLECTION"],
            connection=CONNECTION_STRING,
            use_jsonb=True,
        )

        prompt = ChatPromptTemplate.from_messages([
           ("system", """Eres un asistente académico experto y muy servicial. 
            Tu objetivo es responder a la pregunta basándote en el CONTEXTO DE LOS APUNTES.
            
            REGLAS INQUEBRANTABLES:
            1. Si el contexto proporcionado contiene la información necesaria, responde basándote en él.
            2. Si el contexto está vacío o la información NO está en el contexto, tienes PROHIBIDO responder directamente. DEBES empezar tu respuesta EXACTAMENTE con esta frase literal:
            "⚠️ *Nota: No he encontrado esto en tus apuntes vectorizados, pero según mis conocimientos generales:* "
            (Después de escribir esa frase, puedes dar la respuesta usando tu conocimiento general).

            
            CONTEXTO: {context}
            ASIGNATURA: {subject}"""),
            ("human", "{question}")
        ])

        def imprimir_fuentes(resultados):
            if not resultados: return print("\n[ Sin contexto ]")
            print("\n📚 Fuentes:")
            for i, doc in enumerate(resultados):
                origen = doc.metadata.get('asignatura', '???')
                pag = doc.metadata.get('p', '?')
                tipo = doc.metadata.get('tipo', 'texto')
                cita = doc.metadata.get('cita_previa', '...')
                icono = "🖼️" if "vision" in tipo else "📄"
                print(f"  {i+1}. {icono} {origen} (Pág {pag}) -> {cita}")

        # Selección de asignatura
        asignatura_filtro = input("Introduce asignatura (o Intro para todas): ").strip()
        search_kwargs = {"k": 4}
        if asignatura_filtro:
            search_kwargs["filter"] = {"asignatura": asignatura_filtro}
            self.stdout.write(self.style.WARNING(f"Filtrando por: {asignatura_filtro}"))

        while True:
            pregunta = input("\n📝 Tú: ")
            if pregunta.lower() in ['salir', 'exit']: break
            
            if pregunta.lower() == 'test':
                preguntas_test = ["Resumen de la asignatura", "Hazme 2 preguntas de examen", "¿Qué es lo más difícil?"]
                for pre in preguntas_test:
                    print(f"\n--- TEST: {pre} ---")
                    inicio = time.time()
                    res_bd = vector_store.similarity_search(pre, **search_kwargs)
                    contexto = "\n\n".join([d.page_content for d in res_bd])
                    
                    respuesta = (prompt | llm).invoke({"context": contexto, "subject": asignatura_filtro or "Todas", "question": pre})
                    
                    duracion = time.time() - inicio
                    self.stdout.write(self.style.SUCCESS(f"🤖 IA: {respuesta.content}"))
                    print(f"⏱️ Tiempo: {duracion:.2f}s")
                    imprimir_fuentes(res_bd)
            else:
                inicio = time.time()
                res_bd = vector_store.similarity_search(pregunta, **search_kwargs)
                contexto = "\n\n".join([d.page_content for d in res_bd])
                respuesta = (prompt | llm).invoke({"context": contexto, "subject": asignatura_filtro or "Todas", "question": pregunta})
                
                self.stdout.write(self.style.SUCCESS(f"🤖 IA: {respuesta.content}"))
                print(f"⏱️ Tiempo: {time.time() - inicio:.2f}s")
                imprimir_fuentes(res_bd)