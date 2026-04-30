import json
from ollama import Client
from django.conf import settings

def generar_etiquetas(texto):
    """
    Analiza un texto (ya sea extraído de PDF o de la descripción de una imagen)
    y devuelve una lista de etiquetas.
    """
    try:
        # Usamos la URL correcta del entorno Docker
        cliente_ollama = Client(host=settings.AI_SETTINGS["CODE_DETECT_URL"])
        
        prompt_sistema = (
            "Eres un clasificador de texto experto. Tu única tarea es responder en formato JSON puro. "
            "Analiza el texto y decide si contiene código fuente, archivos de configuración (XML, JSON, YAML) "
            "o comandos de consola/terminal. "
            "REGLAS: "
            "1. Si ves sintaxis de programación, etiquetas XML o rutas/comandos de Linux, es código. "
            "2. Responde estrictamente con este formato: {\"tags\": [\"CODE\", \"PYTHON\"]} "
            "3. Siempre debes incluir 'CODE' en la lista si es código. Puedes añadir el lenguaje si lo reconoces. "
            "4. Si es texto normal, responde: {\"tags\": []}"
        )

        res = cliente_ollama.chat(
            model=settings.AI_SETTINGS["CODE_DETECT_MODEL"], 
            messages=[
                {'role': 'system', 'content': prompt_sistema}, 
                {'role': 'user', 'content': f"Genera etiquetas para este texto: {texto[:1000]}"}
            ],
            format="json"
        )
        
        resultado = json.loads(res['message']['content'])
        # Aseguramos que devolvemos una lista limpia en mayúsculas
        etiquetas = resultado.get("tags", [])
        return [str(tag).strip().upper() for tag in etiquetas if tag]
        
    except Exception as e:
        print(f"Error en etiquetator: {e}")
        return []