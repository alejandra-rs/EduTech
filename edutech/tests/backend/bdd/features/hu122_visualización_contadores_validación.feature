Feature: Visualización de contadores de valoraciones
  Como usuario registrado
  Quiero poder ver la cantidad de "Me gusta" y "No me gusta" de una publicación
  Para compararlo con otra publicación y decidir cuál tiene mejor calidad.

  Background:
    Given que existe el curso "3"
    And que existe la asignatura "Producción de Software" para ese año
    And que existe el estudiante "Pepe Garcia"

  Scenario: Visualizar contadores con votos
    Given que existe un post con 3 votos positivos y 1 voto negativo
    When pido el detalle del post
    Then la respuesta tiene el estado 200
    And la respuesta muestra 3 "Me gusta" y 1 "No me gusta"

  Scenario: Visualizar contadores sin votos
    Given que existe un post sin valoraciones
    When pido el detalle del post
    Then la respuesta tiene el estado 200
    And la respuesta muestra 0 "Me gusta" y 0 "No me gusta"