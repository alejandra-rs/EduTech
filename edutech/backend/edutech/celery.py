# backend/edutech/celery.py

import os
from celery import Celery

# 1. Enlazar con Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.edutech.settings')

# 2. Crear la app UNA SOLA VEZ
app = Celery('edutech')

# 3. Leer configuraciones desde settings.py
app.config_from_object('django.conf:settings', namespace='CELERY')

# 4. Auto-descubrir tareas
app.autodiscover_tasks()