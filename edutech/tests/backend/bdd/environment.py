import os, sys

base_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", "..", "backend"))
if base_dir not in sys.path:
    sys.path.insert(0, base_dir)

# Must be set before django.setup() so read_env() doesn't override with Docker 'db' hostname
os.environ["DATABASE_URL"] = "postgres://admin_edutech:1234@localhost:5432/edutech_db"
os.environ["REDIS_URL"] = "redis://localhost:6379/0"
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "backend.edutech.settings")

import django
django.setup()

from django.test.utils import setup_test_environment, teardown_test_environment
from django.test.runner import DiscoverRunner
from django.core.management import call_command
from rest_framework.test import APIClient

def before_all(context):
    setup_test_environment()
    from django.conf import settings
    settings.EMAIL_BACKEND = 'django.core.mail.backends.locmem.EmailBackend'
    context.runner = DiscoverRunner()
    context.old_db_config = context.runner.setup_databases()

def before_scenario(context, scenario):
    call_command('flush', interactive=False)

    context.client = APIClient()
    context.patches = []
    from django.core import mail
    mail.outbox = []

def after_scenario(context, scenario):
    for p in getattr(context, 'patches', []):
        try:
            p.stop()
        except RuntimeError:
            pass
    context.patches = []

def after_all(context):
    context.runner.teardown_databases(context.old_db_config)
    teardown_test_environment()