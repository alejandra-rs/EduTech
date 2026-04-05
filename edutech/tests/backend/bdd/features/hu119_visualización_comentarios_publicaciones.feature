Feature: Visualización de comentarios de publicaciones
  Como estudiante
  Quiero poder ver los comentarios que otros estudiantes han realizado sobre un material de estudio
  Para poder leer dudas resueltas, correcciones o debates sobre los apuntes sin tener que preguntar lo mismo.

  Background:
    Given que existe el curso "3"
    And que existe la asignatura "Producción de Software" para ese año
    And que existe el estudiante "Pepe Garcia"
    And que existe un post con título "Kanban Guide" en la asignatura

  Scenario: Ver lista de comentarios existente
    Given que el post tiene los comentarios "Buen material" y "Muy completo"
    When pido los comentarios del post
    Then la respuesta tiene el estado 200
    And la respuesta contiene 2 comentarios
    And los comentarios están ordenados cronológicamente
    And cada comentario muestra el autor, el contenido, la fecha y la hora

  Scenario: Visualizar sección sin comentarios
    When pido los comentarios del post
    Then la respuesta tiene el estado 200
    And la respuesta contiene 0 comentarios