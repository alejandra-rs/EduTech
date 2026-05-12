# Servicios

Durante este sprint, los servicios se separaron para evitar el alto acoplamiento y los cuellos de botella en los despliegues. Esto nos permite escalar cada componente de forma independiente y mejorar la estabilidad general del sistema. Los archivos se encuentran en la carpeta [`services`](../../edutech/frontend/src/services/).

## Funciones disponibles

### Años y cursos

| Función | Descripción |
| --- | --- |
| [`getYears`](../../edutech/frontend/src/services/connections-courses.ts#L4-L17) | Obtiene los cursos disponibles para un usuario |
| [`getCourses`](../../edutech/frontend/src/services/connections-courses.ts#L19-L33) | Obtiene las asignaturas de un curso |
| [`getCourse`](../../edutech/frontend/src/services/connections-courses.ts#L35-L44) | Obtiene el detalle de una asignatura a partir de su identificador |

### Contenido (publicaciones, documentos)

| Función | Descripción |
| --- | --- |
| [`getPosts`](../../edutech/frontend/src/services/connections-documents.ts#L26-L36) | Obtiene los recursos publicados en una asignatura |
| [`getMyPosts`](../../edutech/frontend/src/services/connections-documents.ts#L13-L23) | Obtiene los recursos subidos por el usuario |
| [`getFilteredPosts`](../../edutech/frontend/src/services/connections-documents.ts#L38-L55) | Obtiene los recursos de una asignatura filtrados por título y tipo |
| [`getLinkDescarga`](../../edutech/frontend/src/services/connections-documents.ts#L11) | Devuelve la URL de descarga de un documento PDF |
| [`postDocument`](../../edutech/frontend/src/services/connections-documents.ts#L57-L98) | Publica un nuevo documento PDF en una asignatura |
| [`postQuiz`](../../edutech/frontend/src/services/connections-documents.ts#L100-L122) | Publica un nuevo cuestionario en una asignatura |
| [`postFlashCardDeck`](../../edutech/frontend/src/services/connections-documents.ts#L124-L143) | Publica un nuevo grupo de _flashcards_ en una asignatura |
| [`checkQuizAnswers`](../../edutech/frontend/src/services/connections-documents.ts#L145-L158) | Envía las respuestas de un cuestionario y devuelve su corrección |
| [`deleteDocument`](../../edutech/frontend/src/services/connections-documents.ts#L298-L309) | Elimina un recurso publicado |

### Borradores

| Función | Descripción |
| --- | --- |
| [`getDraft`](../../edutech/frontend/src/services/connections-documents.ts#L160-L169) | Obtiene un borrador a partir de su identificador |
| [`getDrafts`](../../edutech/frontend/src/services/connections-documents.ts#L171-L180) | Obtiene la lista de borradores guardados por un usuario |
| [`saveDraft`](../../edutech/frontend/src/services/connections-documents.ts#L208-L235) | Crea un borrador de cuestionario o _flashcards_ |
| [`updateDraft`](../../edutech/frontend/src/services/connections-documents.ts#L236-L264) | Actualiza un borrador existente de _cuestionario_ o _flashcards_ |
| [`uploadPDFDraft`](../../edutech/frontend/src/services/connections-documents.ts#L266-L286) | Sube un documento PDF como borrador e inicia su vectorización |
| [`deleteDraft`](../../edutech/frontend/src/services/connections-documents.ts#L288-L296) | Elimina un borrador |

### Inteligencia Artificial

| Función | Descripción |
| --- | --- |
| [`askChatbot`](../../edutech/frontend/src/services/connections-ia.ts#L6-L29) | Permite al estudiante realizar una consulta al chatbot |
| [`generateDocumentDescription`](../../edutech/frontend/src/services/connections-ia.ts#L31-L51) | Genera automáticamente una descripción para un borrador de documento |
| [`connectToDocumentStatus`](../../edutech/frontend/src/services/connections-ia.ts#L53-L63) | Establece una conexión _WebSocket_ para monitorizar el estado de vectorización de un archivo |

### Reportes y Moderación

| Función | Descripción |
| --- | --- |
| [`getReportReasons`](../../edutech/frontend/src/services/interactions/connections-reports.ts#L4-L13) | Obtiene la lista de motivos disponibles para realizar un reporte |
| [`createReport`](../../edutech/frontend/src/services/interactions/connections-reports.ts#L15-L30) | Envía un nuevo reporte asociado a una publicación |
| [`getReports`](../../edutech/frontend/src/services/interactions/connections-reports.ts#L32-L50) | Obtiene de reportes pendientes de revisión (requiere permisos de administrador) |
| [`rejectPostReports`](../../edutech/frontend/src/services/interactions/connections-reports.ts#L52-L63) | Descarta todos los reportes asociados a una publicación (requiere permisos de administrador) |
| [`checkUserReport`](../../edutech/frontend/src/services/interactions/connections-reports.ts#L66-L75) | Verifica si el usuario ya ha reportado previamente una publicación específica |
| [`createCommentReport`](../../edutech/frontend/src/services/interactions/connections-reports.ts#L77-L92) | Envía un nuevo reporte asociado a un comentario |
| [`resolveReport`](../../edutech/frontend/src/services/interactions/connections-reports.ts#L95-L113) | Resuelve un reporte activo, eliminando el contenido, permitiendo adjuntar un mensaje e imagen como evidencia |

### Sesiones de Estudio

| Función | Descripción |
| :--- | :--- |
| [`getStudySessions`](../../edutech/frontend/src/services/connections-studysessions.ts#L7-L40) | Obtiene la lista de sesiones de estudio, con filtros por asignatura o fecha|
| [`getStudySession`](../../edutech/frontend/src/services/connections-studysessions.ts#L42-L53) | Obtiene los detalles de una sesión de estudio específica |
| [`createStudySession`](../../edutech/frontend/src/services/connections-studysessions.ts#L57-L82) | Crea una nueva sesión de estudio asociada a una asignatura |
| [`deleteStudySession`](../../edutech/frontend/src/services/connections-studysessions.ts#L84-L87) | Elimina una sesión de estudio existente |
| [`starStudySession`](../../edutech/frontend/src/services/connections-studysessions.ts#L91-L98) | Permite a un estudiante participar en una sesión de estudio |
| [`unstarStudySession`](../../edutech/frontend/src/services/connections-studysessions.ts#L100-L106) | Permite a un estudiante dejar de participar en una sesión de estudio |

### Universidades y Carreras

| Función | Descripción |
| :--- | :--- |
| [`getUniversities`](../../edutech/frontend/src/services/connections-degrees.ts#L5-L15) | Obtiene la lista de universidades disponibles en el sistema |
| [`getYearById`](../../edutech/frontend/src/services/connections-degrees.ts#L17-L27) | Obtiene los detalles de un curso específico |
| [`getDegrees`](../../edutech/frontend/src/services/connections-degrees.ts#L29-L39) | Obtiene las carreras asociadas a una universidad |
| [`getDegreesByUserId`](../../edutech/frontend/src/services/connections-degrees.ts#L41-L51) | Obtiene las titulaciones asociadas a un estudiante |
| [`saveUserDegree`](../../edutech/frontend/src/services/connections-degrees.ts#L53-L69) | Guarda o actualiza las titulaciones asociadas a un estudiante |
| [`getDegreeName`](../../edutech/frontend/src/services/connections-degrees.ts#L71-L82) | Obtiene nombre de una carrera a partir de su identificador |
| [`getDegreeInfo`](../../edutech/frontend/src/services/connections-degrees.ts#L84-L95) | Obtiene el detalle de una carrera |

### Usuarios

| Función | Descripción |
| --- | --- |
| [`getUserByEmail`](../../edutech/frontend/src/services/connections-students.ts#L5-L16) | Obtiene un usuario a partir de su dirección de correo electrónico |
| [`getUserPhoto`](../../edutech/frontend/src/services/connections-students.ts#L18-L42) | Obtiene la foto de perfil del usuario |
| [`postUser`](../../edutech/frontend/src/services/connections-students.ts#L44-L68) | Registra un nuevo usuario en el sistema |
| [`syncUser`](../../edutech/frontend/src/services/connections-students.ts#L70-L78) | Sincroniza el usuario con el backend y lo crea si no existe todavía |
| [`checkIsAdmin`](../../edutech/frontend/src/services/connections-students.ts#L80-L90) | Comprueba si el usuario autenticado tiene permisos de administrador |

### Interacción (likes, dislikes, comentarios)

| Función | Descripción |
| --- | --- |
| [`getComments`](../../edutech/frontend/src/services/interactions/connections-comments.ts#L4-L13) | Obtiene los comentarios de un recurso |
| [`postComment`](../../edutech/frontend/src/services/interactions/connections-comments.ts#L15-L28) | Publica un comentario en un recurso |
| [`getLikes`](../../edutech/frontend/src/services/interactions/connections-rating.ts#L5-L9) | Obtiene el estado de _like_ del usuario en un recurso y el recuento total de _likes_ |
| [`addLike`](../../edutech/frontend/src/services/interactions/connections-rating.ts#L11-L19) | Añade un _like_ a un recurso |
| [`removeLike`](../../edutech/frontend/src/services/interactions/connections-rating.ts#L21-L24) | Elimina un _like_ de un recurso |
| [`getDislikes`](../../edutech/frontend/src/services/interactions/connections-rating.ts#L26-L30) | Obtiene el estado de _dislike_ del usuario en un recurso y el recuento total de _dislikes_ |
| [`addDislike`](../../edutech/frontend/src/services/interactions/connections-rating.ts#L32-L40) | Añade un _dislike_ a un recurso |
| [`removeDislike`](../../edutech/frontend/src/services/interactions/connections-rating.ts#L42-L45) | Elimina un _dislike_ de un recurso |

### Suscripciones

| Función | Descripción |
| --- | --- |
| [`getSubscriptions`](../../edutech/frontend/src/services/connections-courses.ts#L46-L55) | Obtiene las suscripciones de un usuario |
| [`checkSubscription`](../../edutech/frontend/src/services/connections-courses.ts#L57-L67) | Verifica si el usuario está suscrito a una asignatura concreta |
| [`subscribeToCourse`](../../edutech/frontend/src/services/connections-courses.ts#L69-L86) | Suscribe al usuario a una asignatura |
| [`unsubscribe`](../../edutech/frontend/src/services/connections-courses.ts#L88-L99) | Cancela la suscripción del usuario a una asignatura |
