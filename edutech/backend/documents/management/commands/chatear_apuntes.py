import os
from django.core.management.base import BaseCommand
from django.conf import settings
from langchain_ollama import OllamaEmbeddings, ChatOllama
from langchain_postgres.vectorstores import PGVector
from langchain_core.prompts import ChatPromptTemplate
import time

class Command(BaseCommand):
    help = 'Abre un chat interactivo en la terminal para hablar con tus apuntes'

    def handle(self, *args, **kwargs):
        self.stdout.write(self.style.WARNING("Conectando con la base de datos y los modelos de IA..."))

        # 1. CONEXIÓN A POSTGRES (Igual que en el vectorizador)
        url_original = os.environ.get('DATABASE_URL')
        CONNECTION_STRING = url_original.replace("postgres://", "postgresql+psycopg://")

        # 2. MODELOS DE IA (Usando tu settings)
        embeddings = OllamaEmbeddings(
            base_url=settings.AI_SETTINGS["EMBEDDING_URL"],
            model=settings.AI_SETTINGS["EMBEDDING_MODEL"]
        )
        
        llm = ChatOllama(
            base_url=settings.AI_SETTINGS["CHAT_URL"],
            model=settings.AI_SETTINGS["CHAT_MODEL"],
            temperature=0.2 # Temperatura baja para que no se invente cosas (alucinaciones)
        )

        vector_store = PGVector(
            embeddings=embeddings,
            collection_name=settings.AI_SETTINGS["VECTOR_DB_COLLECTION"],
            connection=CONNECTION_STRING,
            use_jsonb=True,
        )

        # 3. EL PROMPT (Usando Mensajes de Sistema para forzar las reglas)
        mensajes = [
            ("system", """Eres un asistente académico experto y muy servicial. 
            Tu objetivo es responder a la pregunta basándote en el CONTEXTO DE LOS APUNTES.
            
            REGLAS INQUEBRANTABLES:
            1. Si el contexto proporcionado contiene la información necesaria, responde basándote en él.
            2. Si el contexto está vacío o la información NO está en el contexto, tienes PROHIBIDO responder directamente. DEBES empezar tu respuesta EXACTAMENTE con esta frase literal:
            "⚠️ *Nota: No he encontrado esto en tus apuntes vectorizados, pero según mis conocimientos generales:* "
            (Después de escribir esa frase, puedes dar la respuesta usando tu conocimiento general).

            CONTEXTO DE LOS APUNTES:
            {context}
             
            """),
            ("human", "{question}")
        ]
        
        prompt = ChatPromptTemplate.from_messages(mensajes)

        self.stdout.write(self.style.SUCCESS("\n" + "="*50))
        self.stdout.write(self.style.SUCCESS("🤖 CHATBOT ACADÉMICO LISTO (Escribe 'salir' para terminar)"))
        self.stdout.write(self.style.SUCCESS("="*50 + "\n"))

        def imprimir_fuentes(resultados):
            """Función auxiliar para imprimir las fuentes de forma limpia"""
            if not resultados:
                print("\n[ No se extrajo contexto de la BD ]")
                return
                
            print("\n📚 Fuentes consultadas en la base de datos:")
            for i, doc in enumerate(resultados):
                origen = doc.metadata.get('asignatura', 'Desconocida')
                pag = doc.metadata.get('p', '?')
                tipo = doc.metadata.get('tipo', 'texto')
                cita = doc.metadata.get('cita_previa', 'Fragmento no disponible')
                
                # Le ponemos un icono visual si es imagen o texto
                icono = "🖼️ [Visión]" if tipo == "vision" else "📄 [Texto]"
                
                print(f"  {i+1}. {icono} {origen} (Pág {pag})")
                print(f"     └─ \"{cita}\"")

        # 4. EL BUCLE DEL CHAT
        while True:
            # Pedimos la pregunta al usuario en la terminal
            pregunta = input("\n📝 Tú: ")
            
            if pregunta.lower() in ['salir', 'exit', 'quit']:
                self.stdout.write(self.style.WARNING("¡Nos vemos!"))
                break
                
            if pregunta.lower() == 'test':
                preguntas = ["¿Qué es un objeto en Python?", "¿Cómo puedo imprimir los números del 1 al 10 por pantalla?"]
                for pre in preguntas:
                    print(f"\n--- INICIANDO TEST: {pre} ---")
                    self.stdout.write("🧠 IA pensando y buscando en los apuntes...")

                    inicio = time.time()
                    resultados_bd = vector_store.similarity_search(pre, k=3)
                    contexto_extraido = "\n\n".join([doc.page_content for doc in resultados_bd])

                    cadena_final = prompt | llm
                    respuesta_ia = cadena_final.invoke({
                        "context": contexto_extraido,
                        "question": pre
                    })

                    self.stdout.write(self.style.SUCCESS(f"\n🤖 IA: {respuesta_ia.content}"))
                    
                    fin = time.time()
                    duracion = fin - inicio
                    print(f"\n⏱️ Tiempo de respuesta: {duracion:.2f} segundos")
                    
                    # Imprimir las nuevas referencias detalladas
                    imprimir_fuentes(resultados_bd)
            else:
                self.stdout.write("🧠 IA pensando y buscando en los apuntes...")

                resultados_bd = vector_store.similarity_search(pregunta, k=3)
                contexto_extraido = "\n\n".join([doc.page_content for doc in resultados_bd])

                cadena_final = prompt | llm
                respuesta_ia = cadena_final.invoke({
                    "context": contexto_extraido,
                    "question": pregunta
                })

                self.stdout.write(self.style.SUCCESS(f"\n🤖 IA: {respuesta_ia.content}"))
                
                # Imprimir las nuevas referencias detalladas
                imprimir_fuentes(resultados_bd)