import os

# Set before importing main settings so environ.Env.read_env() (overwrite=False)
# doesn't replace these with the Docker-internal 'db' hostname from .env
os.environ["DATABASE_URL"] = "postgres://admin_edutech:1234@localhost:5432/edutech_db"
os.environ["REDIS_URL"] = "redis://localhost:6379/0"

from backend.edutech.settings import *  # noqa

EMAIL_BACKEND = "django.core.mail.backends.locmem.EmailBackend"
