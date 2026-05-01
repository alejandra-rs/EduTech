import json
from channels.generic.websocket import AsyncWebsocketConsumer

class DocumentStatusConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.document_id = self.scope['url_route']['kwargs']['document_id']
        self.room_group_name = f'document_{self.document_id}'

        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )
        await self.accept()

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )

    async def document_status(self, event):
        status = event['status']
        message = event['message']

        await self.send(text_data=json.dumps({
            'status': status,
            'message': message
        }))