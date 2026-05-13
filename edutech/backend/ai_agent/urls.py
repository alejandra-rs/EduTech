from django.urls import path
from .views.chat_bot import ChatAcademicoView
from .views.generate_description import GenerateDescriptionView, ValidateDocument
from .views.generate_material import GenerateMaterial
urlpatterns = [
    path("chat/", ChatAcademicoView.as_view(), name="chat-academico"),
    path("documents/<int:draft_id>/generate-description/", GenerateDescriptionView.as_view(), name="generar-descripcion"),
    path("documents/<int:draft_id>/validate-documet/", ValidateDocument.as_view(), name="validar-documento"),
    path("generate-material/", GenerateMaterial.as_view(), name="generar-material"),
]
