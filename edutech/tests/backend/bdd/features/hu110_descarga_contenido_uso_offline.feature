Feature: Descarga de Contenido para Uso Offline
  Como estudiante
  Quiero descargar un documento PDF
  Para leerlo sin conexión a internet

  Background:
    Given que existe el curso "3"
    And que existe la asignatura "Producción de Software" para ese año
    And que existe el estudiante "Pepe Garcia"

  Scenario: Descarga exitosa
    Given que existe un post PDF con título "Scrum"
    And que el servicio de almacenamiento devuelve una URL
    When solicito descargar el PDF del post
    Then la respuesta redirige con un código 302
    And la cabecera Location contiene la URL

  Scenario: Intentar descargar un post que es un vídeo
    Given que existe un post de tipo vídeo con título "Vídeo Kanban"
    When solicito descargar el PDF del post
    Then la respuesta tiene el estado 404

  Scenario: Intentar descargar un post que no existe
    When solicito descargar el post con id 99999
    Then la respuesta tiene el estado 404