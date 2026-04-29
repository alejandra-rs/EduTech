Feature: Publicación de grupos de flashcards
  Como estudiante
  Quiero subir grupos de flashcards con preguntas y respuestas
  Para que otros estudiantes puedan repasar el vocabulario de la asignatura.

  Background:
    Given que existe el curso "3"
    And que existe la asignatura "Producción de Software" para ese año
    And que existe el estudiante "Pepe Garcia"

  Scenario: Publicación exitosa de un grupo de flashcards
    When el estudiante publica un grupo de flashcards con título "Vocabulario Tema 2"
    Then la respuesta tiene el estado 201
    And el archivo de tipo "FLA" con título "Vocabulario Tema 2" aparece en la base de datos
    And las flashcards están almacenadas en la base de datos

  Scenario: Publicar un grupo sin ninguna tarjeta
    When el estudiante intenta publicar un grupo de flashcards sin tarjetas
    Then la respuesta tiene el estado 400
    And no se guarda el archivo

  Scenario: Publicar un grupo con una sola tarjeta
    When el estudiante publica un grupo de flashcards con una sola tarjeta
    Then la respuesta tiene el estado 201
    And el archivo de tipo "FLA" con título "Una sola tarjeta" aparece en la base de datos

  Scenario: Publicar un grupo de flashcards sin asignatura
    When el estudiante intenta publicar un grupo de flashcards sin especificar asignatura
    Then la respuesta tiene el estado 400
    And no se guarda el archivo
