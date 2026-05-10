Feature: Fijar contenido guardado
  Como estudiante
  Quiero poder fijar contenido guardado en mi espacio personal
  Para acceder más cómodamente a los recursos que considero importantes.

  Background:
    Given que existe el curso "3"
    And que existe la asignatura "Producción de Software" para ese año
    And que existe el estudiante "Pepe Garcia"
    And que existe un post con título "Kanban Guide" en la asignatura
    And que existe el espacio personal del estudiante
    And que el estudiante tiene el contenido guardado en su carpeta raíz

  Scenario: Fijar contenido guardado
    Given que el contenido no está fijado
    When el estudiante fija el contenido
    Then la respuesta tiene el estado 200
    And el contenido aparece en la sección de fijados
    And el contenido sigue perteneciendo a su carpeta original

  Scenario: Desfijar contenido guardado
    Given que el contenido está fijado
    When el estudiante desfija el contenido
    Then la respuesta tiene el estado 200
    And el contenido ya no aparece en la sección de fijados
    And el contenido sigue perteneciendo a su carpeta original
