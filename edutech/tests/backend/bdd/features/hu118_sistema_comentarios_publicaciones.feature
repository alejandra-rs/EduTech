Feature: Sistema de comentarios en publicaciones
  Como estudiante
  Quiero poder comentar una publicación
  Para preguntar sobre el contenido, corregir información o matizar explicaciones.

  Background:
    Given que existe el curso "3"
    And que existe la asignatura "Producción de Software" para ese año
    And que existe el estudiante "Pepe Garcia"
    And que existe un post con título "Kanban Guide" en la asignatura

  Scenario: Publicar un comentario
    When el estudiante publica el comentario "¿Cuál es la diferencia entre Kanban y Scrum?"
    Then la respuesta tiene el estado 201
    And el comentario aparece en la sección de comentarios del post
    And el comentario muestra el autor, la fecha y la hora

  Scenario: Intentar publicar un comentario vacío
    When el estudiante intenta publicar un comentario vacío
    Then la respuesta tiene el estado 400
    And no se publica el comentario