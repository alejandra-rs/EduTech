Feature: Subida de documentos PDF
  Como estudiante
  Quiero subir documentos en formato PDF a una asignatura concreta
  Para que estén disponibles para todos los estudiantes.

  Background:
    Given que existe el curso "3"
    And que existe la asignatura "Producción de Software" para ese año
    And que existe el estudiante "Pepe Garcia"

  Scenario: Subida exitosa de un documento PDF a la asignatura
    When el estudiante sube un PDF válido con título "kanban.pdf"
    Then la respuesta tiene el estado 201
    And el archivo de tipo "PDF" con título "kanban.pdf" aparece en la base de datos
    And el archivo aparece listado en los documentos de la asignatura


  Scenario: Subir un PDF demasiado grande
    When el estudiante intenta subir un PDF que sobrepasa los 600KB
    Then la respuesta tiene el estado 400
    And no se guarda el archivo

  Scenario: Subir un archivo con extensión incorrecta
    When el estudiante intenta subir un archivo llamado "apuntes.docx"
    Then la respuesta tiene el estado 400
    And no se guarda el archivo

  Scenario: Intentar subir sin adjuntar ningún archivo
    When el estudiante intenta subir un post sin adjuntar ningún archivo
    Then la respuesta tiene el estado 400
    And no se guarda el archivo