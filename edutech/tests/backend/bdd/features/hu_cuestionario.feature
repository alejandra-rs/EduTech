Feature: Publicación de cuestionarios
  Como estudiante
  Quiero subir cuestionarios con preguntas y respuestas
  Para que otros estudiantes puedan practicar los contenidos de la asignatura.

  Background:
    Given que existe el curso "3"
    And que existe la asignatura "Producción de Software" para ese año
    And que existe el estudiante "Pepe Garcia"

  Scenario: Publicación exitosa de un cuestionario válido
    When el estudiante publica un cuestionario con título "Repaso del tema 1"
    Then la respuesta tiene el estado 201
    And el archivo de tipo "QUI" con título "Repaso del tema 1" aparece en la base de datos
    And el cuestionario tiene las preguntas almacenadas

  Scenario: Publicar un cuestionario sin preguntas
    When el estudiante intenta publicar un cuestionario sin preguntas
    Then la respuesta tiene el estado 400
    And no se guarda el archivo

  Scenario: Publicar una pregunta con una sola respuesta
    When el estudiante intenta publicar un cuestionario con una pregunta de una sola respuesta
    Then la respuesta tiene el estado 400
    And no se guarda el archivo

  Scenario: Publicar una pregunta sin ninguna respuesta correcta
    When el estudiante intenta publicar un cuestionario sin respuestas correctas
    Then la respuesta tiene el estado 400
    And no se guarda el archivo

  Scenario: Publicar un cuestionario sin asignatura
    When el estudiante intenta publicar un cuestionario sin especificar asignatura
    Then la respuesta tiene el estado 400
    And no se guarda el archivo
