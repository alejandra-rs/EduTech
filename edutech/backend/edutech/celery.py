import os
from celery import Celery

# 1. ENLAZAR CON DJANGO
# Le decimos a Celery dónde están las configuraciones de tu proyecto para que pueda
# acceder a tu base de datos, a tus modelos, etc.
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.edutech.settings')
app = Celery('backend.edutech')

# 2. CREAR LA APLICACIÓN CELERY
# Creamos la instancia principal de Celery y le damos el nombre de tu proyecto
app = Celery('edutech')

# 3. LEER CONFIGURACIONES
# Le decimos a Celery que lea sus configuraciones desde tu archivo settings.py de Django.
# El "namespace='CELERY'" significa que todas las variables de Celery en tu settings.py 
# tendrán que empezar por "CELERY_" (ej: CELERY_BROKER_URL).
app.config_from_object('django.conf:settings', namespace='CELERY')

# 4. BUSCAR TAREAS AUTOMÁTICAMENTE
# Esta es la magia. Le dice a Celery: "Busca en todas mis apps instaladas un archivo 
# que se llame tasks.py y cárgalo". Por eso luego crearemos `ia/tasks.py`.
app.autodiscover_tasks()