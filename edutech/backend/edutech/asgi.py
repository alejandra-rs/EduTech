"""
ASGI config for edutech project.

It exposes the ASGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/6.0/howto/deployment/asgi/
"""

import os
from django.core.asgi import get_asgi_application
from channels.routing import ProtocolTypeRouter, URLRouter
from channels.auth import AuthMiddlewareStack
import documents.routing
import study_sessions.routing

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "backend.edutech.settings")

# 1. INICIALIZAR DJANGO PRIMERO (OBLIGATORIO)
django_asgi_app = get_asgi_application()

application = ProtocolTypeRouter(
    {
        "http": django_asgi_app,
        "websocket": AuthMiddlewareStack(
            URLRouter(
                documents.routing.websocket_urlpatterns
                + study_sessions.routing.websocket_urlpatterns
            )
        ),
    }
)
