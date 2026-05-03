import os

os.environ.setdefault("DATABASE_URL", "sqlite:///test_local.db")
os.environ.setdefault("REDIS_URL", "redis://localhost:6379/0")

from backend.edutech.settings import *

EMAIL_BACKEND = "django.core.mail.backends.locmem.EmailBackend"
