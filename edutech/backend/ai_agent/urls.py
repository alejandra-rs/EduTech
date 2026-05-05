from django.urls import path
from .views import ChatAcademicoView
from .views import GenerateDescriptionView

urlpatterns = [
    path("chat/", ChatAcademicoView.as_view(), name="chat-academico"),
    path("documents/<int:draft_id>/generate-description/", GenerateDescriptionView.as_view(), name="generar-descripcion")
]
