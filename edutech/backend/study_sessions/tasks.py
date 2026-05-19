import asyncio
import json

import httpx
import websockets
from celery import shared_task
from channels.layers import get_channel_layer
from django.conf import settings


@shared_task(bind=True)
def connect_to_twitch_eventsub(self, study_session_id: int, broadcaster_twitch_id: str, access_token: str, twitch_user_id: str):
    asyncio.run(_listen(study_session_id, broadcaster_twitch_id, access_token, twitch_user_id))


async def _listen(study_session_id: int, broadcaster_twitch_id: str, access_token: str, twitch_user_id: str) -> None:
    channel_layer = get_channel_layer()
    group_name    = f"study_session_{study_session_id}"

    async with websockets.connect("wss://eventsub.wss.twitch.tv/ws") as ws:
        async for raw in ws:
            msg      = json.loads(raw)
            msg_type = msg.get("metadata", {}).get("message_type")

            if msg_type == "session_welcome":
                twitch_session_id = msg["payload"]["session"]["id"]
                await _create_eventsub_subscription(twitch_session_id, broadcaster_twitch_id, access_token, twitch_user_id)

            elif msg_type == "notification":
                event = msg["payload"]["event"]
                await channel_layer.group_send(
                    group_name,
                    {
                        "type": "twitch_message",
                        "data": {
                            "chatter":    event["chatter_user_name"],
                            "color":      event.get("color", "#FFFFFF"),
                            "text":       event["message"]["text"],
                            "message_id": event["message_id"],
                        },
                    },
                )

            elif msg_type == "session_keepalive":
                pass


async def _create_eventsub_subscription(twitch_session_id: str, broadcaster_twitch_id: str, access_token: str, twitch_user_id: str) -> None:
    async with httpx.AsyncClient() as client:
        resp = await client.post(
            "https://api.twitch.tv/helix/eventsub/subscriptions",
            headers={
                "Client-Id":     settings.TWITCH_CLIENT_ID,
                "Authorization": f"Bearer {access_token}",
                "Content-Type":  "application/json",
            },
            json={
                "type":    "channel.chat.message",
                "version": "1",
                "condition": {
                    "broadcaster_user_id": broadcaster_twitch_id,
                    "user_id":             twitch_user_id,
                },
                "transport": {
                    "method":     "websocket",
                    "session_id": twitch_session_id,
                },
            },
        )
        resp.raise_for_status()
