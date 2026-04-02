Feature: Subida de vídeos de YouTube
  Como estudiante
  Quiero enlazar un vídeo de YouTube como material
  Para compartir contenido audiovisual con mis compañeros

  Background:
    Given que existe el curso "3"
    And que existe la asignatura "Producción de Software" para ese año
    And que existe el estudiante "Pepe Garcia"

  Scenario: Subida exitosa de vídeo
    Given que el vídeo de YouTube existe
    When el estudiante sube el vídeo de YouTube "https://www.youtube.com/watch?v=dQw4w9WgXcQ"
    Then la respuesta tiene el estado 201
    And el post de tipo "VID" existe en la base de datos

  Scenario: Subir un enlace de YouTube a un vídeo inexistente
    Given el vídeo de YouTube no existe
    When el estudiante intenta subir el vídeo de YouTube "https://www.youtube.com/watch?v=invalido"
    Then la respuesta tiene el estado 400
    And el error hace referencia al campo "vid"
    And no se ha creado ningún post en la base de datos

  Scenario: Subir un enlace que no es de YouTube
    Given que el vídeo de YouTube no existe
    When el estudiante intenta subir un link no válido "https://www.google.com"
    Then la respuesta tiene el estado 400
    And no se ha creado ningún post en la base de datos

  Scenario: Intentar subir un vídeo sin proporcionar URL
    When el estudiante intenta subir un vídeo sin proporcionar URL
    Then la respuesta tiene el estado 400
    And no se ha creado ningún post en la base de datos