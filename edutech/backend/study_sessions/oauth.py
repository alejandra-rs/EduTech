import secrets
from datetime import timedelta

import httpx
from django.conf import settings
from django.core.cache import cache
from django.utils import timezone

from .models import TwitchCredential
from .token_utils import encrypt


SCOPES = "user:read:chat user:write:chat"


def build_auth_url(student_id: int) -> str:
    state = secrets.token_urlsafe(32)
    cache.set(f"twitch_oauth_{state}", student_id, timeout=300)

    return (
        "https://id.twitch.tv/oauth2/authorize"
        f"?response_type=code"
        f"&client_id={settings.TWITCH_CLIENT_ID}"
        f"&redirect_uri={settings.TWITCH_REDIRECT_URI}"
        f"&scope={SCOPES.replace(' ', '+')}"
        f"&state={state}"
        f"&force_verify=true"
    )


def handle_callback(code: str, state: str) -> TwitchCredential:
    student_id = _validate_student_id(state)
    tokens = _obtain_tokens_with(code)
    twitch_user = _fetch_twitch_user_profile(tokens["access_token"])
    
    return _save_twitch_credentials(student_id, tokens, twitch_user)


def _validate_student_id(state: str) -> int:
    student_id = cache.get(f"twitch_oauth_{state}")
    if student_id is None:
        raise ValueError("Estado inválido o expirado.")
    cache.delete(f"twitch_oauth_{state}")
    return student_id

def _obtain_tokens_with(code: str) -> dict:
    data = {
        "client_id": settings.TWITCH_CLIENT_ID, "client_secret": settings.TWITCH_CLIENT_SECRET,
        "code": code, "grant_type": "authorization_code", "redirect_uri": settings.TWITCH_REDIRECT_URI
    }
    resp = httpx.post("https://id.twitch.tv/oauth2/token", data=data)
    resp.raise_for_status()
    return resp.json()

def _fetch_twitch_user_profile(access_token: str) -> dict:
    headers = {"Client-Id": settings.TWITCH_CLIENT_ID, "Authorization": f"Bearer {access_token}"}
    resp = httpx.get("https://api.twitch.tv/helix/users", headers=headers)
    resp.raise_for_status()
    return resp.json()["data"][0]

def _save_twitch_credentials(student_id: int, tokens: dict, user: dict) -> TwitchCredential:
    expires_at = timezone.now() + timedelta(seconds=tokens["expires_in"])
    defaults = {
        "twitch_user_id": user["id"], "twitch_login": user["login"],
        "access_token": encrypt(tokens["access_token"]), "refresh_token": encrypt(tokens["refresh_token"]),
        "token_expires_at": expires_at
    }
    cred, _ = TwitchCredential.objects.update_or_create(student_id=student_id, defaults=defaults)
    return cred