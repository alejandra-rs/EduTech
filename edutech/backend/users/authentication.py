import hashlib

import requests as http_requests
from django.contrib.auth.models import User
from django.core.cache import cache
from rest_framework.authentication import BaseAuthentication
from rest_framework.exceptions import AuthenticationFailed

GRAPH_ME_ENDPOINT = "https://graph.microsoft.com/v1.0/me"
CACHE_TTL_SECONDS = 5 * 60


class MicrosoftAuthentication(BaseAuthentication):

    def authenticate(self, request):
        token = self._extract_bearer_token(request)
        if token is None:
            return None

        cached_email = self._get_cached_email(token)
        email = cached_email or self._fetch_email_from_graph(token)

        if not cached_email:
            self._cache_email_for_token(token, email)

        user = User.objects.get_or_create(email=email, defaults={"username": email})
        return (user, token)


    def authenticate_header(self, request):
        return "Bearer"
    


    def _extract_bearer_token(self, request):
        auth_header = request.headers.get("Authorization", "")
        if not auth_header.startswith("Bearer "):
            return None
        return auth_header.split(" ", 1)[1].strip()


    def _get_cached_email(self, token):
        cache_key = self._make_cache_key(token)
        return cache.get(cache_key)


    def _fetch_email_from_graph(self, token):
        graph_response = self._call_graph_with(token)
        self._raise_if_graph_rejected(graph_response)
        return self._extract_email_from(graph_response)


    def _call_graph_with(self, token):
        try:
            return http_requests.get(
                GRAPH_ME_ENDPOINT,
                headers={"Authorization": f"Bearer {token}"},
                timeout=5,
            )
        except http_requests.RequestException as exc:
            raise AuthenticationFailed(f"Could not reach Microsoft Graph: {exc}")


    def _raise_if_graph_rejected(self, response):
        if response.status_code == 401:
            raise AuthenticationFailed("Microsoft token is invalid or expired. Please log in again.")
        if not response.ok:
            raise AuthenticationFailed(f"Microsoft Graph returned an unexpected error ({response.status_code}).")


    def _extract_email_from(self, response):
        user_info = response.json()
        email = user_info.get("mail") or user_info.get("userPrincipalName")
        if not email:
            raise AuthenticationFailed("Microsoft Graph did not return an email for this account.")
        return email


    def _cache_email_for_token(self, token, email):
        cache_key = self._make_cache_key(token)
        cache.set(cache_key, email, CACHE_TTL_SECONDS)


    def _make_cache_key(self, token):
        return f"ms_auth:{hashlib.sha256(token.encode()).hexdigest()}"
