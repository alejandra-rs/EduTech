Feature: Reportar comentario inadecuado
  Como estudiante
  Quiero poder reportar un comentario inadecuado
  Para que sea revisado y eliminado si incumple las normas de la comunidad.

  Background:
    Given que existe el curso "3"
    And que existe la asignatura "Producción de Software" para ese año
    And que existe el estudiante "Pepe Garcia"
    And que existe un post con título "Kanban Guide" en la asignatura
    And que existe una razón de reporte "Contenido ofensivo"
    And que el post tiene el comentario "Este comentario es inadecuado"

  Scenario: Envío exitoso del reporte de comentario
    Given que soy un usuario registrado leyendo los comentarios de un material
    When reporto el comentario con motivo "Contenido ofensivo" y descripción "Incumple las normas de la comunidad"
    Then la respuesta tiene el estado 201
    And el sistema registra el reporte asociado a ese comentario

  Scenario: Intento de reporte de comentario sin motivo
    Given que soy un usuario registrado intentando reportar un comentario
    When intento reportar el comentario sin indicar motivo ni descripción
    Then la respuesta tiene el estado 400
    And se muestra un mensaje de error indicando "Debes indicar un motivo para reportar un comentario"
