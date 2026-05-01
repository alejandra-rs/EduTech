Feature: Notificación al creador por contenido eliminado
  Como estudiante creador de un contenido subido
  Quiero recibir una notificación cuando mi contenido haya sido eliminado
  Para estar informado del reporte y de su contenido.

  Background:
    Given que existe el curso "3"
    And que existe la asignatura "Producción de Software" para ese año
    And que existe el estudiante "Pepe Garcia"
    And que existe el administrador "Admin User"
    And que existe un post con título "Material a eliminar" en la asignatura
    And que existe una razón de reporte "Contenido ofensivo"
    And que el post tiene un reporte con motivo "Contenido ofensivo"

  Scenario: Notificación por contenido eliminado
    Given que soy el creador del contenido reportado
    When un administrador elimina mi contenido con el mensaje "Tu publicación infringe las normas de la comunidad"
    Then la respuesta tiene el estado 200
    And recibo un correo electrónico indicando el motivo de reporte
    And la identidad del reportador se mantiene anónima en el correo
