import re
from django.core.exceptions import ValidationError


def validate_twitch_url(value):
    pattern = r"^https?://(www\.)?twitch\.tv/[a-zA-Z0-9_]{4,25}/?$"
    if not re.match(pattern, value):
        raise ValidationError(
            "Introduce una URL válida de Twitch (p. ej. https://www.twitch.tv/nombrecanal)."
        )
