Feature: Reportar contenido inadecuado
  Como estudiante
  Quiero poder reportar contenido inadecuado
  Para que pueda ser revisado.

  Background:
    Given que existe el curso "3"
    And que existe la asignatura "Producción de Software" para ese año
    And que existe el estudiante "Pepe Garcia"
    And que existe un post con título "Material inadecuado" en la asignatura
    And que existe una razón de reporte "Contenido ofensivo"

  Scenario: Reporte exitoso de contenido inadecuado
    Given que soy un usuario registrado
    When reporto el post con motivo "Contenido ofensivo" y descripción "Este contenido no es apropiado"
    Then la respuesta tiene el estado 201
    And el sistema registra el reporte
    And la respuesta muestra un mensaje de confirmación

  Scenario: Intento de reporte sin motivo ni descripción
    Given que soy un usuario registrado en la pantalla de reporte
    When intento enviar el reporte sin seleccionar ni escribir ninguna justificación
    Then la respuesta tiene el estado 400
    And el sistema impide el envío
    And la respuesta muestra el error "Por favor, indica un motivo para el reporte"
