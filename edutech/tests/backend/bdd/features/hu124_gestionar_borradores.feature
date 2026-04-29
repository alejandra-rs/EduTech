# HU-124 – Gestionar Borradores de Contenido
# Como estudiante
# Quiero disponer de una sección de borradores donde guardar cuestionarios y flashcards no publicados
# Para poder editarlos y completarlos antes de hacerlos visibles a otros usuarios.

Feature: Gestionar borradores de contenido
  Como estudiante
  Quiero disponer de una sección de borradores donde guardar cuestionarios y flashcards no publicados
  Para poder editarlos y completarlos antes de hacerlos visibles a otros usuarios.

  Background:
    Given que existe el curso "3"
    And que existe la asignatura "Producción de Software" para ese año
    And que existe el estudiante "Pepe Garcia"

  # Escenario 1: Guardar contenido como borrador
  Scenario: Guardar un cuestionario como borrador no lo publica y lo registra en borradores
    When el estudiante guarda un cuestionario como borrador con título "Borrador Tema 1"
    Then la respuesta tiene el estado 201
    And el borrador no aparece en el listado público de la asignatura
    And el borrador aparece en la sección de borradores del estudiante

  Scenario: Guardar un grupo de flashcards como borrador no lo publica y lo registra en borradores
    When el estudiante guarda un grupo de flashcards como borrador con título "Borrador Flashcards"
    Then la respuesta tiene el estado 201
    And el borrador no aparece en el listado público de la asignatura
    And el borrador aparece en la sección de borradores del estudiante

  # Escenario 2: Visualizar borradores
  Scenario: Acceder a la sección de borradores muestra los cuestionarios y flashcards no publicados
    Given que el estudiante tiene un borrador de cuestionario guardado
    And que el estudiante tiene un borrador de flashcards guardado
    When el estudiante consulta sus borradores
    Then la respuesta tiene el estado 200
    And la respuesta contiene 2 borradores
    And los borradores incluyen uno de tipo "QUI" y otro de tipo "FLA"

  Scenario: Los borradores de otro estudiante no son visibles
    Given que otro estudiante tiene un borrador guardado
    When el estudiante consulta sus borradores
    Then la respuesta tiene el estado 200
    And la respuesta contiene 0 borradores

  # Escenario 3: Editar borrador
  Scenario: Obtener un borrador devuelve su título y contenido para continuar editando
    Given que el estudiante tiene un borrador de cuestionario guardado
    When el estudiante obtiene los datos de ese borrador
    Then la respuesta tiene el estado 200
    And la respuesta contiene el título y las preguntas del borrador

  Scenario: Actualizar un borrador reemplaza su contenido
    Given que el estudiante tiene un borrador de cuestionario guardado
    When el estudiante actualiza el borrador con nuevas preguntas
    Then la respuesta tiene el estado 200
    And el borrador tiene las preguntas actualizadas

  Scenario: Eliminar un borrador lo borra definitivamente
    Given que el estudiante tiene un borrador de cuestionario guardado
    When el estudiante elimina el borrador
    Then la respuesta tiene el estado 204
    And el borrador ya no existe en la base de datos
