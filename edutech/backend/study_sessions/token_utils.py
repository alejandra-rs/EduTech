import base64
import hashlib
from datetime import timedelta

import httpx
from cryptography.fernet import Fernet
from django.conf import settings
from django.utils import timezone


def encrypt(value: str) -> str:
    return _fernet().encrypt(value.encode()).decode()


def decrypt(value: str) -> str:
    """Decrypt a previously encrypted string."""
    return _fernet().decrypt(value.encode()).decode()


def _fernet() -> Fernet:
    raw = hashlib.sha256(settings.SECRET_KEY.encode()).digest()
    return Fernet(base64.urlsafe_b64encode(raw))


def get_valid_access_token(credential) -> str:
    if timezone.now() >= credential.token_expires_at - timedelta(minutes=5):
        _refresh_credential(credential)
    return decrypt(credential.access_token)


def _refresh_credential(credential) -> None:
    resp = httpx.post(
        "https://id.twitch.tv/oauth2/token",
        data={
            "grant_type":    "refresh_token",
            "refresh_token": decrypt(credential.refresh_token),
            "client_id":     settings.TWITCH_CLIENT_ID,
            "client_secret": settings.TWITCH_CLIENT_SECRET,
        },
    )
    resp.raise_for_status()
    data = resp.json()
    credential.access_token = encrypt(data["access_token"])
    credential.refresh_token = encrypt(data["refresh_token"])
    credential.token_expires_at = timezone.now() + timedelta(seconds=data["expires_in"])
    credential.save(update_fields=["access_token", "refresh_token", "token_expires_at"])
