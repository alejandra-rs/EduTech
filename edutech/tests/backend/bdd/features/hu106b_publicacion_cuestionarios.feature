# HU-106b – Publicación de Cuestionarios
# Como estudiante
# Quiero publicar un cuestionario de evaluación que he elaborado
# Para compartirlo con el resto de estudiantes de la asignatura.

Feature: Publicación de cuestionarios
  Como estudiante
  Quiero publicar un cuestionario de evaluación que he elaborado
  Para compartirlo con el resto de estudiantes de la asignatura.

  Background:
    Given que existe el curso "3"
    And que existe la asignatura "Producción de Software" para ese año
    And que existe el estudiante "Pepe Garcia"

  # Escenario 1: Publicación de un cuestionario elaborado
  Scenario: Publicar un cuestionario válido lo hace visible en la asignatura
    When el estudiante publica un cuestionario con título "Repaso del tema 1"
    Then la respuesta tiene el estado 201
    And el archivo de tipo "QUI" con título "Repaso del tema 1" aparece en la base de datos
    And el cuestionario aparece listado en los materiales de la asignatura
    And el cuestionario tiene las preguntas almacenadas

  # Escenario 2: Publicación de un cuestionario sin título
  Scenario: Publicar un cuestionario con título vacío devuelve error
    When el estudiante intenta publicar un cuestionario sin título
    Then la respuesta tiene el estado 400
    And la respuesta contiene error en el campo "title"
    And no se guarda el archivo

  # Escenario 3: Publicación de un cuestionario sin preguntas
  Scenario: Publicar un cuestionario sin preguntas devuelve error
    When el estudiante intenta publicar un cuestionario sin preguntas
    Then la respuesta tiene el estado 400
    And no se guarda el archivo

  Scenario: Publicar una pregunta con una sola respuesta devuelve error
    When el estudiante intenta publicar un cuestionario con una pregunta de una sola respuesta
    Then la respuesta tiene el estado 400
    And no se guarda el archivo

  Scenario: Publicar una pregunta sin ninguna respuesta correcta devuelve error
    When el estudiante intenta publicar un cuestionario sin respuestas correctas
    Then la respuesta tiene el estado 400
    And no se guarda el archivo
