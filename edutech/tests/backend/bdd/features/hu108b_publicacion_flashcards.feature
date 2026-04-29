# HU-108b – Publicación de Flashcards
# Como estudiante
# Quiero publicar un grupo de tarjetas de estudio que he elaborado
# Para compartirlo con el resto de estudiantes de la asignatura.

Feature: Publicación de grupos de flashcards
  Como estudiante
  Quiero publicar un grupo de tarjetas de estudio que he elaborado
  Para compartirlo con el resto de estudiantes de la asignatura.

  Background:
    Given que existe el curso "3"
    And que existe la asignatura "Producción de Software" para ese año
    And que existe el estudiante "Pepe Garcia"

  # Escenario 1: Publicación de un grupo de flashcards elaborado
  Scenario: Publicar un grupo válido lo hace visible en la asignatura
    When el estudiante publica un grupo de flashcards con título "Vocabulario Tema 2"
    Then la respuesta tiene el estado 201
    And el archivo de tipo "FLA" con título "Vocabulario Tema 2" aparece en la base de datos
    And el grupo aparece listado en los materiales de la asignatura
    And las flashcards están almacenadas en la base de datos

  # Escenario 2: Publicación de un grupo sin título
  Scenario: Publicar un grupo con título vacío devuelve error
    When el estudiante intenta publicar un grupo de flashcards sin título
    Then la respuesta tiene el estado 400
    And la respuesta contiene error en el campo "title"
    And no se guarda el archivo

  # Escenario 3: Publicación de un grupo sin tarjetas
  Scenario: Publicar un grupo sin ninguna tarjeta devuelve error
    When el estudiante intenta publicar un grupo de flashcards sin tarjetas
    Then la respuesta tiene el estado 400
    And no se guarda el archivo

  Scenario: Publicar un grupo de flashcards sin especificar asignatura devuelve error
    When el estudiante intenta publicar un grupo de flashcards sin especificar asignatura
    Then la respuesta tiene el estado 400
    And no se guarda el archivo
