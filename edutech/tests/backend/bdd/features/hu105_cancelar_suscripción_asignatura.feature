Feature: Cancelación de suscripción a asignatura
  Como estudiante suscrito a una asignatura
  Quiero anular mi suscripción a dicha asignatura
  Para dejar de recibir notificaciones de nuevo contenido.

  Background:
    Given que existe el curso "3"
    And que existe la asignatura "Producción de Software" para ese año
    And que existe el estudiante "Pepe Garcia"

  Scenario: Cancelar suscripción
    Given que el estudiante está suscrito a la asignatura
    When el estudiante hace clic en "cancelar suscripción"
    Then la respuesta tiene el estado 200
    And el estudiante ya no está suscrito a la asignatura
    And la asignatura desaparece del listado de asignaturas suscritas del estudiante

  Scenario: Cancelar suscripción de una asignatura a la que no está suscrito
    Given que el estudiante no está suscrito a la asignatura
    When el estudiante intenta cancelar la suscripción
    Then la respuesta tiene el estado 404
    And el estudiante continúa sin estar suscrito a la asignatura