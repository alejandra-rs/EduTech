# HU-107 – Autoevaluación con Cuestionarios
# Como estudiante
# Quiero poder responder a un cuestionario creado previamente en una asignatura
# Para autoevaluarme y comprobar mis conocimientos.

Feature: Autoevaluación con cuestionarios
  Como estudiante
  Quiero poder responder a un cuestionario creado previamente en una asignatura
  Para autoevaluarme y comprobar mis conocimientos.

  Background:
    Given que existe el curso "3"
    And que existe la asignatura "Producción de Software" para ese año
    And que existe el estudiante "Pepe Garcia"
    And que existe un cuestionario publicado con preguntas y respuestas

  # Escenario 1: Completar el formulario con éxito
  Scenario: Responder correctamente muestra la nota obtenida y marca las preguntas acertadas
    When el estudiante envía las respuestas correctas al cuestionario
    Then la respuesta tiene el estado 200
    And la puntuación obtenida es 1 de 1
    And los resultados indican que la pregunta fue acertada

  Scenario: Responder incorrectamente obtiene puntuación cero y muestra la respuesta correcta
    When el estudiante envía una respuesta incorrecta al cuestionario
    Then la respuesta tiene el estado 200
    And la puntuación obtenida es 0 de 1
    And los resultados muestran las respuestas correctas para los fallos

  Scenario: No responder obtiene puntuación cero y muestra la respuesta correcta
    When el estudiante envía el cuestionario sin seleccionar ninguna respuesta
    Then la respuesta tiene el estado 200
    And la puntuación obtenida es 0 de 1
    And los resultados muestran las respuestas correctas para los fallos
