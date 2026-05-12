Feature: Modificar contenido guardado
  Como estudiante
  Quiero poder guardar o eliminar un contenido de mi espacio personal
  Para acceder o dejar de acceder a él desde mi perfil.

  Background:
    Given que existe el curso "3"
    And que existe la asignatura "Producción de Software" para ese año
    And que existe el estudiante "Pepe Garcia"
    And que existe un post con título "Kanban Guide" en la asignatura
    And que existe el espacio personal del estudiante

  Scenario: Guardar contenido nuevo
    Given que el estudiante no tiene el contenido guardado
    When el estudiante guarda el contenido en su carpeta raíz
    Then la respuesta tiene el estado 201
    And el contenido aparece guardado en la carpeta raíz

  Scenario: Eliminar contenido que ya está guardado
    Given que el estudiante tiene el contenido guardado en su carpeta raíz
    When el estudiante elimina el contenido guardado
    Then la respuesta tiene el estado 204
    And el contenido ya no aparece en el espacio personal

  Scenario: Guardar un borrador no está permitido
    Given que existe un borrador con título "Borrador sin publicar"
    When el estudiante intenta guardar el borrador en su carpeta raíz
    Then la respuesta tiene el estado 400
    And el contenido no se guarda
