import json
from django.core.management.base import BaseCommand
from sqlalchemy import create_engine, text
from ai_agent.vectorizator import CONNECTION_STRING
from ai_agent.etiquetator import generar_etiquetas

class Command(BaseCommand):
    help = 'Limpia metadatos viejos (tipo_contenido, lenguaje) y re-etiqueta todos los vectores con la nueva estructura de tags'

    def handle(self, *args, **kwargs):
        engine = create_engine(CONNECTION_STRING)
        
        with engine.connect() as conn:
            self.stdout.write(self.style.WARNING("Recuperando todos los vectores de la base de datos..."))
            
            # CORRECCIÓN 1: Pedimos la columna 'document' en lugar de 'page_content'
            rows = conn.execute(text("SELECT id, document, cmetadata FROM langchain_pg_embedding")).fetchall()
            total = len(rows)
            
            if total == 0:
                self.stdout.write(self.style.ERROR("No hay vectores en la base de datos."))
                return

            self.stdout.write(self.style.WARNING(f"Comenzando limpieza y etiquetado de {total} vectores..."))

            for index, row in enumerate(rows, 1):
                # 1. Recuperar el diccionario de metadatos actual
                meta = dict(row.cmetadata) if row.cmetadata else {}
                
                # 2. LIMPIEZA DE RASTROS ANTIGUOS
                if "tipo_contenido" in meta:
                    del meta["tipo_contenido"]
                if "lenguaje" in meta:
                    del meta["lenguaje"]

                # 3. GENERAR NUEVAS ETIQUETAS
                # CORRECCIÓN 2: Leemos row.document
                nuevas_etiquetas = generar_etiquetas(row.document)
                
                # Usamos un Set para no tener etiquetas duplicadas si ya existían
                tags_actuales = set(meta.get("tags", []))
                for tag in nuevas_etiquetas:
                    tags_actuales.add(tag)
                
                # Guardamos la lista en el metadato
                meta["tags"] = list(tags_actuales)

                # 4. ACTUALIZAR EN BASE DE DATOS
                conn.execute(
                    text("UPDATE langchain_pg_embedding SET cmetadata = CAST(:meta AS jsonb) WHERE id = :id"),
                    {"meta": json.dumps(meta), "id": row.id}
                )
                
                self.stdout.write(f"[{index}/{total}] ID: {row.id[:8]}... | Tags: {meta['tags']}")

            # Guardamos los cambios
            conn.commit()
            
        self.stdout.write(self.style.SUCCESS("\n✨ ¡Limpieza y Etiquetado Masivo Completado con Éxito! ✨"))