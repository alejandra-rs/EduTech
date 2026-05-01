Feature: Visualización de próximas sesiones de estudio
  Como estudiante
  Quiero poder ver las sesiones de estudio venideros
  Para poder estar atento, unirme y trabajar en conjunto con otros compañeros.

  Background:
    Given que existe el curso "3"
    And que existe la asignatura "Producción de Software" para ese año
    And que existe el estudiante "Pepe Garcia"
    And que la asignatura tiene sesiones de estudio programadas

  Scenario: Ver lista de próximas sesiones
    Given que soy un usuario registrado
    When accedo a las sesiones de estudio de una asignatura
    Then veo un listado con las sesiones programadas ordenadas cronológicamente
    And cada sesión muestra la fecha, la hora y el creador
