Feature: Filtrado de material por tipo
  Como estudiante
  Quiero filtrar los documentos de una asignatura por el formato de la publicación
  Para encontrar más cómodamente el material

  Background:
    Given que existe el curso "3"
    And que existe la asignatura "Producción de Software" para ese año
    And que existe el estudiante "Pepe García"
    And que existen 2 posts PDF y 2 posts de vídeo en el sistema

  Scenario: Filtrar únicamente por PDF
    When filtro los documentos por tipo "PDF"
    Then la respuesta tiene el estado 200
    And encuentro 2 resultados
    And todos los resultados son de tipo "PDF"

  Scenario: Filtrar únicamente por vídeo
    When filtro los documentos por tipo "VID"
    Then la respuesta tiene el estado 200
    And encuentro 2 resultados
    And todos los resultados son de tipo "VID"

  Scenario: Filtrar por PDF y vídeo a la vez
    When filtro los documentos por tipo PDF y VID a la vez
    Then la respuesta tiene el estado 200
    And encuentro 4 resultados
    And los resultados incluyen PDFs y vídeos

  Scenario: Filtrar por un tipo desconocido
    When filtro los documentos por tipo "OTRO"
    Then la respuesta tiene el estado 200
    And encuentro 0 resultados