# HU-108a – Elaboración de Flashcards
# Como estudiante
# Quiero elaborar tarjetas de estudio en una asignatura
# Para repasar conceptos de la asignatura.

Feature: Elaboración de grupos de flashcards
  Como estudiante
  Quiero elaborar tarjetas de estudio en una asignatura
  Para repasar conceptos de la asignatura.

  Background:
    Given que existe el curso "3"
    And que existe la asignatura "Producción de Software" para ese año
    And que existe el estudiante "Pepe Garcia"

  # Escenario 1: Creación de un grupo de tarjetas de estudio
  Scenario: Crear un grupo de tarjetas con título, descripción y tarjetas pregunta/respuesta
    When el estudiante crea un grupo de flashcards con título, descripción y tarjetas
    Then la respuesta tiene el estado 201
    And el archivo de tipo "FLA" con título "Vocabulario Tema 3" aparece en la base de datos
    And las flashcards están almacenadas en la base de datos

  # Escenario 2: Creación de una tarjeta dentro de un grupo
  Scenario: Añadir múltiples tarjetas al grupo
    When el estudiante crea un grupo de flashcards con 3 tarjetas distintas
    Then la respuesta tiene el estado 201
    And el grupo almacena las 3 tarjetas

  # Escenario 3: Eliminación de una tarjeta (límite mínimo de 1 tarjeta)
  Scenario: Publicar un grupo con una sola tarjeta es válido
    When el estudiante publica un grupo de flashcards con una sola tarjeta
    Then la respuesta tiene el estado 201
    And el archivo de tipo "FLA" con título "Una sola tarjeta" aparece en la base de datos
