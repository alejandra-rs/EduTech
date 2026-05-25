# backend/edutech/celery.py

import os
from celery import Celery

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "backend.edutech.settings")

app = Celery("edutech")

app.config_from_object("django.conf:settings", namespace="CELERY")
app.autodiscover_tasks()
