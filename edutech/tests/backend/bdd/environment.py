import os, sys, django

base_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", "..", "backend"))
if base_dir not in sys.path:
    sys.path.insert(0, base_dir)

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "backend.edutech.settings")
django.setup()

from django.test.utils import setup_test_environment
from django.core.management import call_command
from rest_framework.test import APIClient

def before_all(context):
    setup_test_environment()

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
