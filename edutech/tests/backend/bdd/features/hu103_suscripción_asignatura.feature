Feature: Suscripción a asignatura
  Como estudiante
  Quiero poder suscribirme a una asignatura
  Para ser notificado cuando algún estudiante sube material a ella.

  Background:
    Given que existe el curso "3"
    And que existe la asignatura "Producción de Software" para ese año
    And que existe el estudiante "Pepe Garcia"

  Scenario: Suscribirse con éxito
    Given que el estudiante no está suscrito a la asignatura
    When el estudiante hace clic en el botón "Suscribirme" de la asignatura
    Then la respuesta tiene el estado 201
    And el estudiante queda suscrito a la asignatura
    And la asignatura aparece en el listado de asignaturas suscritas del estudiante

  Scenario: Suscribirse a una asignatura en la que ya está suscrito
    Given que el estudiante ya está suscrito a la asignatura
    When el estudiante intenta suscribirse de nuevo a la asignatura
    Then la respuesta tiene el estado 200
    And el estudiante continúa suscrito a la asignatura