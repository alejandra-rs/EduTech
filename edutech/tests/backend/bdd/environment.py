from django.test.utils import setup_test_environment
from rest_framework.test import APIClient

def before_all(context):
    setup_test_environment()

def before_scenario(context, scenario):
    context.client = APIClient()
    context.patches = []

def after_scenario(context, scenario):
    for p in context.patches:
        try:
            p.stop()
        except RuntimeError:
            pass

    context.patches = []