Feature: Valoración positiva de publicaciones
  Como usuario registrado
  Quiero poder indicar que el contenido me ha gustado
  Para que otros estudiantes puedan ver que este material es útil y valorado.

  Background:
    Given que existe el curso "3"
    And que existe la asignatura "Producción de Software" para ese año
    And que existe el estudiante "Pepe Garcia"
    And que existe un post con título "Kanban Guide" en la asignatura

  Scenario: Dar "Me gusta"
    Given que el estudiante no ha valorado el post
    When el estudiante hace clic en el botón de "Me gusta"
    Then la respuesta tiene el estado 201
    And el contador de "Me gusta" del post aumenta en uno
    And el voto del estudiante queda registrado como positivo

  Scenario: Quitar el "Me gusta"
    Given que el estudiante ya ha valorado positivamente el post
    When el estudiante vuelve a hacer clic en el botón de "Me gusta"
    Then la respuesta tiene el estado 200
    And el contador de "Me gusta" del post disminuye en uno
    And el voto del estudiante es eliminado

  Scenario: Cambio de voto de negativo a positivo
    Given que el estudiante ha valorado negativamente el post
    When el estudiante hace clic en el botón de "Me gusta"
    Then la respuesta tiene el estado 201
    And el contador de "No me gusta" del post disminuye en uno
    And el contador de "Me gusta" del post aumenta en uno
    And el voto del estudiante queda registrado como positivo