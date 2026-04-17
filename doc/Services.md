# Servicios

El archivo principal de servicios ([`connections.js`](../edutech/frontend/src/services/connections.js)) centraliza las 
llamadas al _backend_, desacoplándolo del _frontend_.

## Funciones disponibles

### Años y cursos
| Función                                                                 | Descripción                                        |
|-------------------------------------------------------------------------|----------------------------------------------------|
| [`getYears`](../edutech/frontend/src/services/connections.js#L3-L12)    | Obtiene los cursos académicos disponibles          |
| [`getCourses`](../edutech/frontend/src/services/connections.js#L14-L27) | Obtiene las asignaturas de un curso y cuatrimestre |
| [`getCourse`](../edutech/frontend/src/services/connections.js#L29-L38)  | Obtiene el detalle de una asignatura               |


### Contenido (publicaciones, documentos)
| Función                                                                       | Descripción                                               |
|-------------------------------------------------------------------------------|-----------------------------------------------------------|
| [`getPosts`](../edutech/frontend/src/services/connections.js#L42-L51)         | Obtiene los documentos de una asignatura                  |
| [`getDocument`](../edutech/frontend/src/services/connections.js#L65-L75)      | Obtiene un documento específico                           |
| [`getLinkDescarga`](../edutech/frontend/src/services/connections.js#L40)      | Devuelve el enlace de descarga de un documento PDF        |
| [`getFilteredPosts`](../edutech/frontend/src/services/connections.js#L53-L63) | Obtiene documentos de una asignatura filtrados por título |
| [`postDocument`](../edutech/frontend/src/services/connections.js#L77-L98)     | Publica un nuevo documento en una asignatura              |


### Usuarios
| Función                                                                       | Descripción                                                       |
|-------------------------------------------------------------------------------|-------------------------------------------------------------------|
| [`syncUser`](../edutech/frontend/src/services/connections.js#L142-L152)       | Sincroniza el usuario con el backend; lo crea si no existe        |
| [`postUser`](../edutech/frontend/src/services/connections.js#L154-L179)       | Registra un nuevo usuario en el sistema                           |
| [`getUserPhoto`](../edutech/frontend/src/services/connections.js#L181-L213)   | Obtiene la foto de perfil del usuario desde Microsoft             |
| [`getUserByEmail`](../edutech/frontend/src/services/connections.js#L215-L225) | Obtiene un usuario a partir de su dirección de correo electrónico |


### Interacción (likes, dislikes, comentarios)
| Función                                                                      | Descripción                                                                                             |
|------------------------------------------------------------------------------|---------------------------------------------------------------------------------------------------------|
| [`getComments`](../edutech/frontend/src/services/connections.js#L310-L319)   | Obtiene los comentarios de un documento                                                                 |
| [`postComment`](../edutech/frontend/src/services/connections.js#L321-L339)   | Publica un comentario en un documento                                                                   |
| [`getLikes`](../edutech/frontend/src/services/connections.js#L227-L237)      | Obtiene el estado de _like_ de un usuario en un documento y la cuenta de _likes_ de ese documento       |
| [`addLike`](../edutech/frontend/src/services/connections.js#L239-L254)       | Añade un _like_ a un documento (elimina el _dislike_ si existe)                                         |
| [`removeLike`](../edutech/frontend/src/services/connections.js#L256-L267)    | Elimina un _like_ de un documento                                                                       |
| [`getDislikes`](../edutech/frontend/src/services/connections.js#L268-L278)   | Obtiene el estado de _dislike_ de un usuario en un documento y la cuenta de _dislikes_ de ese documento |
| [`addDislike`](../edutech/frontend/src/services/connections.js#L280-L295)    | Añade un _dislike_ a un documento (elimina el _like_ si existe)                                         |
| [`removeDislike`](../edutech/frontend/src/services/connections.js#L297-L308) | Elimina un _dislike_ de un documento                                                                    |

### Suscripciones
| Función                                                                          | Descripción                                           |
|----------------------------------------------------------------------------------|-------------------------------------------------------|
| [`checkSubscription`](../edutech/frontend/src/services/connections.js#L100-L110) | Verifica si el usuario está suscrito a una asignatura |
| [`subscribeToCourse`](../edutech/frontend/src/services/connections.js#L112-L126) | Suscribe al usuario a una asignatura                  |
| [`unsubscribe`](../edutech/frontend/src/services/connections.js#L128-L139)       | Cancela la suscripción                                |
