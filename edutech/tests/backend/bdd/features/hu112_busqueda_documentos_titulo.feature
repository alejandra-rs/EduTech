Feature: Búsqueda de Documentos por Título
  Como estudiante
  Quiero poder buscar un documento por su título
  Para poder acceder al material de estudio de manera más eficiente

  Background:
    Given que existe el curso "3"
    And que existe la asignatura "Producción de Software" para ese año
    And que existe el estudiante "Pepe Garcia"

  Scenario: Buscar contenido por título
    Given que existen posts titulados "Kanban Guide" y "Scrum Guide"
    And que existe un post titulado "Scrum Master"
    When busco posts por el título "scrum"
    Then encuentro 2 resultados
    And los títulos de los resultados contienen "scrum"

  Scenario: Búsqueda sin resultados
    Given que existen posts titulados "Kanban Guide" y "Scrum Guide"
    When busco posts por el título "DevOps"
    Then encuentro 0 resultados