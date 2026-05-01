Feature: Expansión a Otras Universidades y Titulaciones
  Como estudiante
  Quiero poder seleccionar mi universidad y titulación
  Para acceder a contenido adaptado a mi situación.

  Scenario: Presentar universidades y titulaciones al estudiante sin situación asociada
    Given que soy un estudiante registrado sin titulación asociada
    When accedo a la lista de universidades disponibles
    Then la respuesta tiene el estado 200
    And la lista de universidades incluye opciones para seleccionar

  Scenario: Asociar una titulación al perfil del estudiante
    Given que existe el curso "3"
    And que existe el estudiante "Pepe Garcia"
    When el estudiante asocia la titulación a su perfil
    Then la respuesta tiene el estado 200
    And el perfil del estudiante refleja la titulación asociada

  Scenario: Ver titulaciones asociadas desde el perfil
    Given que existe el curso "3"
    And que existe el estudiante "Pepe Garcia"
    And que el estudiante tiene la titulación asociada a su perfil
    When consulto el perfil del estudiante
    Then la respuesta tiene el estado 200
    And el perfil muestra la titulación asociada

  Scenario: Acceso a contenido filtrado según la situación
    Given que existe el curso "3"
    And que existe la asignatura "Producción de Software" para ese año
    And que existe el estudiante "Pepe Garcia"
    And que el estudiante tiene la titulación asociada a su perfil
    When pido las asignaturas del curso "3"
    Then la respuesta tiene el estado 200
    And los resultados incluyen la asignatura "Producción de Software"
