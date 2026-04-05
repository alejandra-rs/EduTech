Feature: Notificación de nuevo contenido en asignatura
  Como estudiante suscrito a una asignatura
  Quiero poder ser notificado cuando algún estudiante sube material a ella
  Para consultar el nuevo contenido.

  Background:
    Given que existe el curso "3"
    And que existe la asignatura "Producción de Software" para ese año
    And que existe el estudiante "Pepe Garcia" suscrito a la asignatura
    And que existe el estudiante "Maria Lopez"

  Scenario: Notificación tras subida de contenido
    When el estudiante "Maria Lopez" sube un PDF con título "Scrum Guide" a la asignatura
    Then el estudiante "Pepe Garcia" recibe una notificación por correo electrónico
    And la notificación contiene información sobre el nuevo contenido subido

  Scenario: No se notifica a estudiantes no suscritos
    Given que existe el estudiante "Carlos Ruiz" no suscrito a la asignatura
    When el estudiante "Maria Lopez" sube un PDF con título "Scrum Guide" a la asignatura
    Then el estudiante "Carlos Ruiz" no recibe ninguna notificación