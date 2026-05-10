Feature: Creación de carpetas personales
  Como estudiante
  Quiero poder crear carpetas en una estructura jerárquica en mi espacio personal
  Para organizar mi contenido guardado.

  Background:
    Given que existe el curso "3"
    And que existe la asignatura "Producción de Software" para ese año
    And que existe el estudiante "Pepe Garcia"
    And que existe el espacio personal del estudiante

  Scenario: Creación de una carpeta en la raíz
    When el estudiante crea una carpeta llamada "PS" en la raíz
    Then la respuesta tiene el estado 201
    And la carpeta "PS" aparece como hija de la raíz

  Scenario: Creación de una subcarpeta
    Given que el estudiante tiene una carpeta llamada "PS" en la raíz
    When el estudiante crea una carpeta llamada "Scrum" dentro de "PS"
    Then la respuesta tiene el estado 201
    And la carpeta creada tiene profundidad 3

  Scenario: Crear carpeta con nombre duplicado en la misma ubicación
    Given que el estudiante tiene una carpeta llamada "PS" en la raíz
    When el estudiante crea una carpeta llamada "PS" en la raíz
    Then la respuesta tiene el estado 409

  Scenario: Crear carpeta con nombre duplicado en distinta ubicación
    Given que el estudiante tiene una carpeta llamada "PS" en la raíz
    And que el estudiante tiene una carpeta llamada "Scrum" en la raíz
    When el estudiante crea una carpeta llamada "PS" dentro de "Scrum"
    Then la respuesta tiene el estado 201

  Scenario: Modificar nombre de una carpeta
    Given que el estudiante tiene una carpeta llamada "PS" en la raíz
    When el estudiante renombra la carpeta "PS" a "Producción de Software"
    Then la respuesta tiene el estado 200
    And la carpeta tiene el nombre "Producción de Software"

  Scenario: Límite máximo de carpetas por usuario
    Given que el estudiante ha creado 100 subcarpetas
    When el estudiante crea una carpeta llamada "Inválido" en la raíz
    Then la respuesta tiene el estado 400
