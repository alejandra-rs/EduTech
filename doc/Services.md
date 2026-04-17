# Servicios

El archivo principal de servicios centraliza las llamadas a la API mediante `fetch`, desacoplando la lógica de datos del frontend.

## Archivo principal

| Archivo | Descripción |
|--------|------------|
| [connections.js](../edutech/frontend/src/services/connections.js) | Gestión de peticiones HTTP a la API |

---

## Funciones disponibles

### Gestión académica
| Función | Descripción |
|--------|------------|
| getYears | Obtiene los cursos académicos disponibles |
| getCourses | Obtiene las asignaturas de un curso y cuatrimestre |
| getCourse | Obtiene el detalle de una asignatura |

### Gestión de contenido
| Función | Descripción |
|--------|------------|
| getPosts | Obtiene los documentos de una asignatura |
| getDocument | Obtiene un documento específico |

### Usuario
| Función | Descripción |
|--------|------------|
| getUserId | Devuelve el ID del usuario (mock) |

### Suscripciones
| Función | Descripción |
|--------|------------|
| checkSubscription | Verifica si el usuario está suscrito |
| subscribeToCourse | Suscribe al usuario a una asignatura |
| unsubscribe | Cancela la suscripción |