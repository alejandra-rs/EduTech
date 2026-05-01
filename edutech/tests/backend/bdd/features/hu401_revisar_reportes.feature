Feature: Revisar reportes de contenido
  Como administrador
  Quiero poder revisar los contenidos reportados
  Para decidir si deben ser eliminados.

  Background:
    Given que existe el curso "3"
    And que existe la asignatura "Producción de Software" para ese año
    And que existe el estudiante "Pepe Garcia"
    And que existe el administrador "Admin User"
    And que existe un post con título "Material reportado" en la asignatura
    And que existe una razón de reporte "Contenido ofensivo"
    And que el post tiene un reporte con motivo "Contenido ofensivo"

  Scenario: Aceptar un reporte
    Given que soy un usuario moderador
    And estoy en la zona de moderación
    When marco el reporte como válido con el mensaje "El contenido infringe las normas"
    Then la respuesta tiene el estado 200
    And el contenido deja de aparecer en el material de la asignatura
    And desaparecen todos los reportes asociados a dicho contenido

  Scenario: Rechazar un reporte
    Given que soy un usuario moderador
    And estoy en la zona de moderación
    When marco el reporte como inválido
    Then la respuesta tiene el estado 200
    And el contenido se mantiene en el material de la asignatura
    And desaparecen todos los reportes asociados a dicho contenido
