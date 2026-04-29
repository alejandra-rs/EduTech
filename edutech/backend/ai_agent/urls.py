from django.urls import path
from .views import ChatAcademicoView

urlpatterns = [
    path('chat/', ChatAcademicoView.as_view(), name='chat-academico'),
]