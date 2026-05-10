Feature: Organización de contenido en carpetas
  Como estudiante
  Quiero poder mover contenido entre carpetas
  Para organizar mi contenido guardado de forma más cómoda.

  Background:
    Given que existe el curso "3"
    And que existe la asignatura "Producción de Software" para ese año
    And que existe el estudiante "Pepe Garcia"
    And que existe un post con título "Kanban Guide" en la asignatura
    And que existe el espacio personal del estudiante

  Scenario: Mover contenido a otra carpeta
    Given que el estudiante tiene una carpeta llamada "PS" en la raíz
    And que el estudiante tiene una carpeta llamada "Scrum" en la raíz
    And que el estudiante tiene el contenido guardado en la carpeta "PS"
    When el estudiante mueve el contenido a la carpeta "Scrum"
    Then la respuesta tiene el estado 200
    And el contenido pertenece a la carpeta "Scrum"
    And el contenido ya no pertenece a la carpeta "PS"

  Scenario: Mover contenido a una carpeta no válida
    Given que el estudiante tiene una carpeta llamada "PS" en la raíz
    And que el estudiante tiene el contenido guardado en la carpeta "PS"
    When el estudiante intenta mover el contenido a una carpeta inexistente
    Then la respuesta tiene el estado 404
    And el contenido pertenece a la carpeta "PS"

  Scenario: Mover contenido a una carpeta donde ya está guardado
    Given que el estudiante tiene una carpeta llamada "PS" en la raíz
    And que el estudiante tiene el contenido guardado en la carpeta raíz
    And que el estudiante tiene el contenido guardado en la carpeta "PS"
    When el estudiante intenta mover el contenido de la raíz a la carpeta "PS"
    Then la respuesta tiene el estado 409
