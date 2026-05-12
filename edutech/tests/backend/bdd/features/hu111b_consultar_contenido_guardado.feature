Feature: Consultar contenido guardado
  Como estudiante
  Quiero poder consultar mi contenido guardado
  Para acceder a él rápidamente desde mi perfil.

  Background:
    Given que existe el curso "3"
    And que existe la asignatura "Producción de Software" para ese año
    And que existe el estudiante "Pepe Garcia"
    And que existe el espacio personal del estudiante

  Scenario: Consultar contenido guardado en la raíz
    Given que existe un post con título "Kanban Guide" en la asignatura
    And que el estudiante tiene el contenido guardado en su carpeta raíz
    When el estudiante accede a su espacio personal
    Then la respuesta tiene el estado 200
    And la respuesta incluye el contenido guardado

  Scenario: Navegar a una carpeta
    Given que el estudiante tiene una carpeta llamada "PS" en la raíz
    And que existe un post con título "Kanban Guide" en la asignatura
    And que el estudiante tiene el contenido guardado en la carpeta "PS"
    When el estudiante accede a la carpeta "PS"
    Then la respuesta tiene el estado 200
    And la respuesta incluye el contenido guardado

  Scenario: Carpeta vacía
    Given que el estudiante tiene una carpeta llamada "Ejercicios" en la raíz
    When el estudiante accede a la carpeta "Ejercicios"
    Then la respuesta tiene el estado 200
    And la respuesta no incluye contenido guardado
    And la respuesta no incluye subcarpetas
