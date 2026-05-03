import os


def pytest_configure(config):
    # Runs before pytest-django initialises Django, so read_env() in settings.py
    # will see these values and not override them with the Docker 'db' hostname.
    os.environ.setdefault("DATABASE_URL", "postgres://admin_edutech:1234@localhost:5432/edutech_db")
    os.environ.setdefault("REDIS_URL", "redis://localhost:6379/0")
    os.environ.setdefault("EMAIL_BACKEND", "django.core.mail.backends.locmem.EmailBackend")
