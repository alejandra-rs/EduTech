Feature: Creación de anuncios para sesión de estudio
  Como estudiante
  Quiero poder organizar una sesión de estudio
  Para trabajar de forma colaborativa con otros estudiantes.

  Background:
    Given que existe el curso "3"
    And que existe la asignatura "Producción de Software" para ese año
    And que existe el estudiante "Pepe Garcia"

  Scenario: Creación exitosa de anuncio
    Given que soy un usuario registrado
    And estoy en la página de una asignatura
    When hago clic en "Crear sesión de estudio"
    And escribo el título "Repaso Kanban", la descripción "Vamos a repasar Kanban juntos" y la fecha "2027-06-15T10:00:00Z"
    And hago clic en el botón "Publicar"
    Then la respuesta tiene el estado 201
    And el anuncio aparece listado en las sesiones de estudio planificadas para la asignatura

  Scenario: Creación de anuncio sin título
    Given que soy un usuario registrado
    And estoy en la página de una asignatura
    When hago clic en "Crear sesión de estudio"
    And hago clic en "Publicar" sin escribir un título para la sesión
    Then la respuesta tiene el estado 400
    And el sistema muestra el mensaje de error "No se ha indicado un título para la sesión"
    And no se publica el anuncio en la asignatura

  Scenario: Creación de anuncio sin fecha
    Given que soy un usuario registrado
    And estoy en la página de una asignatura
    When hago clic en "Crear sesión de estudio"
    And hago clic en "Publicar" sin indicar una fecha para la sesión
    Then la respuesta tiene el estado 400
    And el sistema muestra el mensaje de error "No se ha indicado una fecha para la sesión"
    And no se publica el anuncio en la asignatura
