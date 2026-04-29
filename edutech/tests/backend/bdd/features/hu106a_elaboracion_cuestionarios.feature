# HU-106a – Elaboración de Cuestionarios
# Como estudiante
# Quiero elaborar un cuestionario de autoevaluación en una asignatura
# Para repasar conceptos de la asignatura.

Feature: Elaboración de cuestionarios
  Como estudiante
  Quiero elaborar un cuestionario de autoevaluación en una asignatura
  Para repasar conceptos de la asignatura.

  Background:
    Given que existe el curso "3"
    And que existe la asignatura "Producción de Software" para ese año
    And que existe el estudiante "Pepe Garcia"

  # Escenario 1: Creación del cuestionario
  Scenario: Crear un cuestionario con título, descripción y preguntas de opción múltiple
    When el estudiante crea un cuestionario con título, descripción y preguntas
    Then la respuesta tiene el estado 201
    And el archivo de tipo "QUI" con título "Cuestionario Tema 1" aparece en la base de datos
    And el cuestionario tiene las preguntas almacenadas

  # Escenario 2: Creación de una pregunta dentro de un cuestionario
  Scenario: Añadir múltiples preguntas al cuestionario
    When el estudiante crea un cuestionario con 3 preguntas distintas
    Then la respuesta tiene el estado 201
    And el cuestionario almacena las 3 preguntas

  # Escenario 3: Eliminación de una pregunta dentro de un cuestionario
  Scenario: Publicar cuestionario omitiendo una pregunta vacía no es posible
    When el estudiante intenta publicar un cuestionario con una pregunta sin título
    Then la respuesta tiene el estado 400
    And no se guarda el archivo
