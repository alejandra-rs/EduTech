Feature: Visualización de material del curso
  Como estudiante
  Quiero ver todos los materiales de un curso concreto
  Para estudiar su contenido

  Background:
    Given que existe el curso "3"
    And que existe la asignatura "Producción de Software" para ese año
    And que existe el estudiante "Pepe Garcia"

  Scenario: Acceder al material de una asignatura
    Given que el curso "Producción de Software" tiene los materiales "Kanban" y "Scrum"
    When pido el material de la asignatura "Producción de Software"
    Then la respuesta tiene el estado 200
    And la respuesta contiene 2 documentos
    And los títulos incluyen "Kanban" y "Scrum"

  Scenario: Acceder al material de una asignatura que no tiene material
    When pido el material de la asignatura "Producción de Software"
    Then la respuesta tiene el estado 200
    And la respuesta contiene 0 documentos

  Scenario: Pedir material de una asignatura que no existe
    When pido el material de la asignatura con id 99999
    Then la respuesta tiene el estado 404