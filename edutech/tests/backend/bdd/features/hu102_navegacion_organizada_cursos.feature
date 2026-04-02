Feature: Navegación Organizada por Cursos
  Como estudiante
  Quiero poder seleccionar un curso
  Para poder visualizar las asignaturas que lo componen

  Background:
    Given que existe el curso "3"

  Scenario: Visualizar asignaturas de un curso
    Given que existen las asignaturas "Producción de Software" y "Ingeniería de Software" en el curso "3"
    When pido las asignaturas del curso "3"
    Then la respuesta tiene el estado 200
    And la respuesta contiene 2 asignaturas
    And los resultados incluyen la asignatura "Producción de Software"
    And los resultados incluyen la asignatura "Ingeniería de Software"

  Scenario: Visualizar asignaturas de un curso vacío
    When pido las asignaturas del curso "3"
    Then la respuesta tiene el estado 200
    And la respuesta contiene 0 asignaturas

  Scenario: Pedir asignaturas de un año que no existe
    When pido las asignaturas de un curso con id 99999
    Then la respuesta tiene el estado 404