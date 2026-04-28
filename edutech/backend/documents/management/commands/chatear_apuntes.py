import os
import json
import ollama
import re
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
            temperature=0.1,
        )

        vector_store = PGVector(
            embeddings=embeddings,
            collection_name=settings.AI_SETTINGS["VECTOR_DB_COLLECTION"],
            connection=CONNECTION_STRING,
            use_jsonb=True,
        )
        propmt_ejercicios = ChatPromptTemplate.from_messages([
            ("system", """Eres un asistente académico. Responde usando el contexto proporcionado trata de hacer referencias a los fragmentos del contexto usando el formato [Ref: X] donde X es el número de referencia del fragmento.
             cuanto más cercano/similar sea tu respuesta al texto de un fragmento, mejor. 
             Si no estás seguro, es mejor no usar una referencia que inventar una. 
             Si el contexto no tiene información relevante, responde de la mejor manera posible sin referencias.
             Pero RECUERDA: SIEMPRE QUE PUEDAS BASA TUS RESPUESTAS EN LOS FRAGMENTOS Y HAZ REFERENCIAS A LOS FRAGMENTOS USADOS.
             SOLICITUD DE EJERCICIOS:
             Si te piden que hagas por ejemplo ejercicios, trata de seguir la estructura de los ejercicios que tengas, cambia los datos pero mantén la estructura. Y referencia la fuente original del ejercicio con [Ref: X].
             Si el fragmento tiene un ejercicio resuelto, puedes usarlo como base para crear el nuevo ejercicio, pero siempre haz referencia al fragmento original usando [Ref: X].
             FRAGMENTOS DE CONTEXTO:
            {context}"""),
            ("human", "{question}")
        ])

        propmt_explicacion = ChatPromptTemplate.from_messages([
            ("system", """Eres un asistente académico. Responde usando el contexto proporcionado trata de hacer referencias a los fragmentos del contexto usando el formato [Ref: X] donde X es el número de referencia del fragmento.
             cuanto más cercano/similar sea tu respuesta al texto de un fragmento, mejor. 
             Si no estás seguro, es mejor no usar una referencia que inventar una. 
             SOLO si el contexto no tiene información relevante, puedes responde de la mejor manera posible sin referencias.
             SOLICITUD DE EXPLICACIONES:
             Se te pedirá que espliques un contepto, tienes que citar textualmente el fragmento que mejor explique el concepto y referenciarlo usando [Ref: X], después deberás añadir un ejeplo con objetos cotidianos para que se entienda mejor. 
             Si te piden que expliques un concepto, trata de basar tu explicación en los fragmentos que tengas, usa tus propias palabras pero mantén la esencia del fragmento. Y referencia la fuente original del concepto con [Ref: X].
             Si el fragmento tiene una explicación clara del concepto, puedes repetirla y siempre haz referencia al fragmento original usando [Ref: X].
             Si el fragmento tiene una explicación pero no tiene un ejemplo, puedes crear un ejemplo basado en la explicación, pero siempre haz referencia al fragmento original usando [Ref: X].
             FRAGMENTOS DE CONTEXTO:
            {context}"""),
            ("human", "{question}")
        ])

        prompt_estricto = ChatPromptTemplate.from_messages([
            ("system", """Eres un asistente académico MUY ESTRICTO. Tu única tarea es responder usando EXCLUSIVAMENTE el contexto proporcionado.
            
            REGLAS INQUEBRANTABLES:
            1. PROHIBIDO INVENTAR. Si no está en el contexto, di: "Se recomienda mirar la documentación oficial."
            2. REGLA DE CITAS: Cada vez que uses información de un fragmento, DEBES poner al final de la frase su número de referencia, usando el formato [Ref: X].
            
            Ejemplo de cómo debes responder:
            "El patrón Singleton asegura una instancia única [Ref: 1]. La arquitectura MVC tiene tres capas [Ref: 4]."
            
            CONTEXTO:
            {context}"""),
            ("human", "{question}")
        ])

        def mapear_fuentes_a_json(respuesta_texto, documentos):
            """
            Modelo B: Toma la respuesta y la vincula párrafo a párrafo con los doc_id.
            """
            try:
                # Preparamos una lista simplificada de los documentos para que el modelo B no se sature
                referencias_breves = []
                for d in documentos:
                    referencias_breves.append({
                        "id": d.metadata.get('doc_id'),
                        "titulo": d.metadata.get('titulo'),
                        "contenido": d.page_content[:300]
                    })

                instrucciones_mapeo = (
                    "Tu tarea es coger una respuesta académica y dividirla en una lista de párrafos. "
                    "Para cada párrafo, debes identificar qué ID de documento de la lista proporcionada es el origen de esa información. "
                    "Si un párrafo no tiene una fuente clara, usa el ID del documento más relevante. "
                    "Responde ÚNICAMENTE con un JSON que sea una lista de objetos: "
                    '[{"parrafo": "texto...", "doc_id": "id_del_doc"}]'
                )

                res = ollama.chat(
                    model=settings.AI_SETTINGS.get("CODE_DETECT_MODEL", "llama3.2:3b"),
                    messages=[
                        {'role': 'system', 'content': instrucciones_mapeo},
                        {'role': 'user', 'content': f"DOCUMENTOS:\n{json.dumps(referencias_breves)}\n\nRESPUESTA A MAPEAR:\n{respuesta_texto}"}
                    ],
                    format="json"
                )
                return json.loads(res['message']['content'])
            except Exception as e:
                return [{"parrafo": respuesta_texto, "doc_id": "error"}]
            

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

        def es_pregunta_de_codigo_con_ia(pregunta):
            try:
                res = ollama.chat(
                    model=settings.AI_SETTINGS.get("CODE_DETECT_MODEL", "llama3.2:3b"),
                    messages=[{'role': 'system', 'content': 'Responde JSON: {"pide_codigo": bool}'},
                              {'role': 'user', 'content': pregunta}],
                    format="json"
                )
                return json.loads(res['message']['content']).get("pide_codigo", False)
            except: return False

        asignatura_filtro = input("Introduce asignatura (o Intro para todas): ").strip()
        search_kwargs = {"k": 6} # Bajamos el K base a 6 para dejar hueco a los de código
        
        if asignatura_filtro:
            search_kwargs["filter"] = {"asignatura": asignatura_filtro}
            self.stdout.write(self.style.WARNING(f"Filtrando por: {asignatura_filtro}"))

        while True:

            pregunta_raw = input("\n📝 Tú: ")
            if pregunta_raw.lower() in ['salir', 'exit']: break
            if pregunta_raw.lower() == 'change':
                asignatura_filtro = input("🎓 Asignatura actual (frontend): ").strip()
                continue


            inicio = time.time()
            filtros = {"asignatura": asignatura_filtro}
            pregunta_busqueda = pregunta_raw
            mencion_con_comillas = re.search(r'@"(.*?)"', pregunta_raw)
            if mencion_con_comillas:
                titulo_real = mencion_con_comillas.group(1).strip()
                print(f"🔍 Mención detectada: '{titulo_real}'")
                filtros["titulo"] = titulo_real
                print(f"Pregunta original: '{mencion_con_comillas.group(0)}'")
                pregunta_busqueda = pregunta_raw.replace(mencion_con_comillas.group(0), "").strip()
                self.stdout.write(self.style.WARNING(f"🎯 Modo precisión: Buscando solo en '{titulo_real}'"))
                

            if es_pregunta_de_codigo_con_ia(pregunta_busqueda):
                self.stdout.write("🔍 Detectada intención de CÓDIGO (6 Texto + 4 Code)")
                # Búsqueda Texto (k=6)
                res_texto = vector_store.similarity_search(pregunta_busqueda, k=6, filter=filtros)
                # Búsqueda Código (k=4)
                filtros_code = {**filtros, "tipo_contenido": "Code"}
                res_code = vector_store.similarity_search(pregunta_busqueda, k=4, filter=filtros_code)
                documentos_recuperados = res_texto + res_code
            else:
                self.stdout.write("📖 Búsqueda estándar (10 Texto)")
                documentos_recuperados = vector_store.similarity_search(pregunta_busqueda, k=10, filter=filtros)

            contexto_str = ""
            mapa_vectores = {} # Diccionario para guardar el vector real en la memoria de Python
            
            for i, d in enumerate(documentos_recuperados):
                ref_num = str(i + 1) # Será 1, 2, 3...
                mapa_vectores[ref_num] = d # Guardamos el objeto LangchainDocument entero
                
                # Le damos a la IA un contexto súper limpio y fácil de referenciar
                contexto_str += f"--- FRAGMENTO [Ref: {ref_num}] ---\n{d.page_content}\n--- FIN FRAGMENTO ---\n\n"

            # 3. GENERAR RESPUESTA
            self.stdout.write("✍️  Escribiendo respuesta estricta...")
            respuesta = (prompt_estricto | llm).invoke({
                "context": contexto_str,
                "question": pregunta_busqueda
            })
            texto_respuesta = respuesta.content
            # 4. PASO B: MODELO MAPEADOR (Convierte a JSON con referencias)

            # 5. CONSTRUCCIÓN DE ENLACES Y SALIDA
            # Añadimos el enlace dinámico a cada párrafo basándonos en el doc_id detectado
            ids_encontrados = set(re.findall(r'\[Ref:\s*(\d+)\]', texto_respuesta))
            
            json_referencias = []
            for ref_id in ids_encontrados:
                if ref_id in mapa_vectores:
                    vector_original = mapa_vectores[ref_id]
                    
                    # ¡Aquí tienes la magia! Extraemos TODO lo del vector
                    doc_id_real = vector_original.metadata.get('doc_id')
                    pagina = vector_original.metadata.get('p', 'N/A')
                    texto_del_vector = vector_original.page_content
                    
                    json_referencias.append({
                        "referencia_texto": ref_id,
                        "doc_id": doc_id_real,
                        "pagina": pagina,
                        "cita_exacta": texto_del_vector[:200] + "...", # Guardamos los primeros 200 caracteres de la fuente
                        "enlace_documento": f"http://tu-dominio.com/documents/download/{doc_id_real}/"
                    })

            # Mostrar el JSON resultante
            nombre_archivo = "ultima_respuesta.txt"
            with open(nombre_archivo, "w", encoding="utf-8") as f:
                f.write("=== PREGUNTA ===\n")
                f.write(f"{pregunta_busqueda}\n\n")
                f.write("=== RESPUESTA DE LA IA ===\n")
                f.write(texto_respuesta)
                f.write("\n\n=== METADATOS DE LOS VECTORES USADOS (JSON) ===\n")
                f.write(json.dumps(json_referencias, indent=2, ensure_ascii=False))

            duracion = time.time() - inicio
            self.stdout.write(self.style.SUCCESS(f"\n ⏱️ Tiempo: Respuesta generada en {duracion:.2f}s"))
            self.stdout.write(self.style.WARNING(f"📄 Revisa el archivo: {nombre_archivo}"))

            