Feature: Eliminación de carpetas personales
  Como estudiante
  Quiero poder eliminar las carpetas de mi espacio personal
  Para simplificar la organización de mi contenido guardado.

  Background:
    Given que existe el curso "3"
    And que existe la asignatura "Producción de Software" para ese año
    And que existe el estudiante "Pepe Garcia"
    And que existe el espacio personal del estudiante

  Scenario: Eliminar carpeta vacía
    Given que el estudiante tiene una carpeta llamada "PS" en la raíz
    When el estudiante elimina la carpeta "PS"
    Then la respuesta tiene el estado 204
    And la carpeta "PS" ya no existe

  Scenario: Eliminar carpeta con contenido elimina también su contenido
    Given que el estudiante tiene una carpeta llamada "PS" en la raíz
    And que existe un post con título "Kanban Guide" en la asignatura
    And que el estudiante tiene el contenido guardado en la carpeta "PS"
    When el estudiante elimina la carpeta "PS"
    Then la respuesta tiene el estado 204
    And el contenido guardado también se elimina

  Scenario: Eliminar carpeta con subcarpetas elimina también las subcarpetas
    Given que el estudiante tiene una carpeta llamada "PS" en la raíz
    And que el estudiante tiene una carpeta llamada "Scrum" dentro de "PS"
    When el estudiante elimina la carpeta "PS"
    Then la respuesta tiene el estado 204
    And la subcarpeta "Scrum" también se elimina

  Scenario: No se puede eliminar la carpeta raíz
    When el estudiante intenta eliminar la carpeta raíz
    Then la respuesta tiene el estado 400
    And la carpeta raíz sigue existiendo
