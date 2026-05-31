# Servicios

A continuación detallamos los servicios implementados. Todos los archivos mencionados se encuentran en la carpeta [`services`](../../edutech/frontend/src/services/).

## Funciones disponibles

### Años y cursos

| Función | Descripción |
| --- | --- |
| [`getYears`](../../edutech/frontend/src/services/connections-courses.ts#L4-L5) | Obtiene los cursos disponibles para un usuario |
| [`getCourses`](../../edutech/frontend/src/services/connections-courses.ts#L7-L13) | Obtiene las asignaturas de un curso |
| [`getCourse`](../../edutech/frontend/src/services/connections-courses.ts#L15-L16) | Obtiene el detalle de una asignatura a partir de su identificador |

### Contenido (publicaciones, documentos)

| Función | Descripción |
| --- | --- |
| [`getPosts`](../../edutech/frontend/src/services/connections-documents.ts#L91-L95) | Obtiene los recursos publicados en una asignatura |
| [`getMyPosts`](../../edutech/frontend/src/services/connections-documents.ts#L85-L89) | Obtiene los recursos subidos por un usuario |
| [`getFilteredPosts`](../../edutech/frontend/src/services/connections-documents.ts#L97-L102) | Obtiene los recursos de una asignatura filtrados por título y tipo |
| [`getMyFilteredPosts`](../../edutech/frontend/src/services/connections-documents.ts#L104-L109) | Obtiene los recursos de un usuario filtrados por título y tipo |
| [`getDocument`](../../edutech/frontend/src/services/connections-documents.ts#L111-L114) | Obtiene el detalle de una publicación individual a partir de su identificador |
| [`getDownloadUrl`](../../edutech/frontend/src/services/connections-documents.ts#L7-L9) | Devuelve la URL de descarga de un documento PDF |
| [`postDocument`](../../edutech/frontend/src/services/connections-documents.ts#L116-L120) | Publica un nuevo documento PDF en una asignatura |
| [`postVideo`](../../edutech/frontend/src/services/connections-documents.ts#L122-L126) | Publica un nuevo vídeo de YouTube en una asignatura |
| [`postQuiz`](../../edutech/frontend/src/services/connections-documents.ts#L128-L141) | Publica un nuevo cuestionario en una asignatura |
| [`postFlashCardDeck`](../../edutech/frontend/src/services/connections-documents.ts#L143-L153) | Publica un nuevo grupo de _flashcards_ en una asignatura |
| [`checkQuizAnswers`](../../edutech/frontend/src/services/connections-documents.ts#L155-L158) | Envía las respuestas de un cuestionario y devuelve su corrección |
| [`deleteDocument`](../../edutech/frontend/src/services/connections-documents.ts#L190-L193) | Elimina un recurso publicado |

### Borradores

| Función | Descripción |
| --- | --- |
| [`getDraft`](../../edutech/frontend/src/services/connections-documents.ts#L160-L163) | Obtiene un borrador a partir de su identificador |
| [`getDrafts`](../../edutech/frontend/src/services/connections-documents.ts#L165-L168) | Obtiene la lista de borradores guardados por un usuario |
| [`saveDraft`](../../edutech/frontend/src/services/connections-documents.ts#L170-L173) | Crea un borrador de cuestionario o _flashcards_ |
| [`updateDraft`](../../edutech/frontend/src/services/connections-documents.ts#L175-178) | Actualiza un borrador existente de cuestionario o _flashcards_ |
| [`uploadPDFDraft`](../../edutech/frontend/src/services/connections-documents.ts#L180-L183) | Sube un documento PDF como borrador e inicia su vectorización |
| [`publishPDFDraft`](../../edutech/frontend/src/services/connections-documents.ts#L195-L198) | Publica un borrador de PDF previamente guardado y vectorizado |
| [`deleteDraft`](../../edutech/frontend/src/services/connections-documents.ts#L185-L188) | Elimina un borrador |

### Inteligencia Artificial

| Función | Descripción |
| --- | --- |
| [`askChatbot`](../../edutech/frontend/src/services/connections-ia.ts#L7-L18) | Permite al estudiante realizar una consulta al chatbot |
| [`generateDocumentDescription`](../../edutech/frontend/src/services/connections-ia.ts#L21-L65) | Genera automáticamente una descripción para un borrador de documento |
| [`validatePDF`](../../edutech/frontend/src/services/connections-ia.ts#L28-L32) | Valida el contenido de un borrador de documento PDF antes de su publicación |
| [`connectToDocumentStatus`](../../edutech/frontend/src/services/connections-ia.ts#L34-L40) | Establece una conexión _WebSocket_ para monitorizar el estado de vectorización de un archivo |
| [`generateMaterial`](../../edutech/frontend/src/services/connections-ia.ts#L42-L51) | Genera material de estudio (flashcards o cuestionario) a partir de una consulta |

### Revisión de Contenido

| Función | Descripción |
| --- | --- |
| [`getRevisionQueue`](../../edutech/frontend/src/services/connections-revision.ts#L4-L12) | Obtiene la lista de documentos PDF revisados por la IA pendientes de aprobación por el administrador |
| [`publishRevision`](../../edutech/frontend/src/services/connections-revision.ts#L15-L25) | Aprueba y publica un documento pendiente de revisión |
| [`discardRevision`](../../edutech/frontend/src/services/connections-revision.ts#L29-L37) | Rechaza y descarta un documento pendiente de revisión |

### Reportes y Moderación

| Función | Descripción |
| --- | --- |
| [`getReportReasons`](../../edutech/frontend/src/services/interactions/connections-reports.ts#L18-L19) | Obtiene la lista de motivos disponibles para realizar un reporte |
| [`createReport`](../../edutech/frontend/src/services/interactions/connections-reports.ts#L21-L27) | Envía un nuevo reporte asociado a una publicación |
| [`getReports`](../../edutech/frontend/src/services/interactions/connections-reports.ts#L30-L33) | Obtiene los reportes pendientes de revisión (requiere permisos de administrador) |
| [`rejectPostReports`](../../edutech/frontend/src/services/interactions/connections-reports.ts#L35-L36) | Descarta todos los reportes asociados a una publicación (requiere permisos de administrador) |
| [`checkUserReport`](../../edutech/frontend/src/services/interactions/connections-reports.ts#L38-L39) | Verifica si el usuario ya ha reportado previamente una publicación específica |
| [`createCommentReport`](../../edutech/frontend/src/services/interactions/connections-reports.ts#L41-L48) | Envía un nuevo reporte asociado a un comentario |
| [`resolveReport`](../../edutech/frontend/src/services/interactions/connections-reports.ts#L50-L56) | Resuelve un reporte activo, eliminando el contenido, permitiendo adjuntar un mensaje e imagen como evidencia |

### Sesiones de Estudio

| Función | Descripción |
| :--- | :--- |
| [`getStudySessions`](../../edutech/frontend/src/services/connections-studysessions.ts#L45-L49) | Obtiene la lista de sesiones de estudio, con filtros por asignatura o fecha|
| [`getStudySession`](../../edutech/frontend/src/services/connections-studysessions.ts#L51-L54) | Obtiene los detalles de una sesión de estudio específica |
| [`createStudySession`](../../edutech/frontend/src/services/connections-studysessions.ts#L56-L69) | Crea una nueva sesión de estudio asociada a una asignatura |
| [`deleteStudySession`](../../edutech/frontend/src/services/connections-studysessions.ts#L71-L72) | Elimina una sesión de estudio existente |
| [`starStudySession`](../../edutech/frontend/src/services/connections-studysessions.ts#L74-L79) | Permite a un estudiante participar en una sesión de estudio |
| [`unstarStudySession`](../../edutech/frontend/src/services/connections-studysessions.ts#L181-L82) | Permite a un estudiante dejar de participar en una sesión de estudio |
| [`getStudySessionComments`](../../edutech/frontend/src/services/connections-studysessions.ts#L84-L87) | Obtiene los comentarios de una sesión de estudio específica |
| [`addStudySessionComment`](../../edutech/frontend/src/services/connections-studysessions.ts#L89-L96) | Añade un comentario a una sesión de estudio |

### Streaming (Twitch)

| Función | Descripción |
| :--- | :--- |
| [`getTwitchStatus`](../../edutech/frontend/src/services/connections-streaming.ts#L11-L12) | Obtiene el estado de la conexión con Twitch de un usuario |
| [`connectTwitch`](../../edutech/frontend/src/services/connections-streaming.ts#L17-L46) | Permite vincular una cuenta de Twitch a un usuario |
| [`disconnectTwitch`](../../edutech/frontend/src/services/connections-streaming.ts#L14-L15) | Desvincula la cuenta de Twitch a un usuario |
| [`startStream`](../../edutech/frontend/src/services/connections-streaming.ts#L48-L53) | Inicia la retransmisión en vivo de una sesión de estudio |
| [`stopStream`](../../edutech/frontend/src/services/connections-streaming.ts#L55-L56) | Detiene la retransmisión en vivo activa de una sesión |
| [`sendTwitchMessage`](../../edutech/frontend/src/services/connections-streaming.ts#L58-L63) | Envía un mensaje al chat de Twitch durante una sesión en vivo |
| [`connectToSessionChat`](../../edutech/frontend/src/services/connections-streaming.ts#L71-L75) | Establece una conexión _WebSocket_ para monitorizar el chat en tiempo real de una sesión de estudio |
| [`connectToSession`](../../edutech/frontend/src/services/connections-streaming.ts#L77-L86) | Establece una conexión _WebSocket_ para monitorizar el estado de una sesión de estudio |

### Mi Espacio (Carpetas y guardados)

| Función | Descripción |
| :--- | :--- |
| [`getRootFolder`](../../edutech/frontend/src/services/connections-studentspace.ts#L4-L5) | Obtiene la carpeta raíz del espacio personal de un usuario con su contenido |
| [`getFolder`](../../edutech/frontend/src/services/connections-studentspace.ts#L7-L8) | Obtiene el contenido de una carpeta específica |
| [`createFolder`](../../edutech/frontend/src/services/connections-studentspace.ts#L10-L15) | Crea una nueva carpeta dentro de una carpeta padre |
| [`renameFolder`](../../edutech/frontend/src/services/connections-studentspace.ts#L17-L22) | Renombra una carpeta existente |
| [`deleteFolder`](../../edutech/frontend/src/services/connections-studentspace.ts#L24-L26) | Elimina una carpeta y su contenido |
| [`moveFolder`](../../edutech/frontend/src/services/connections-studentspace.ts#L28-L33) | Mueve una carpeta a otra ubicación |
| [`savePost`](../../edutech/frontend/src/services/connections-studentspace.ts#L35-L40) | Guarda una publicación en una carpeta del espacio personal |
| [`deleteSavedPost`](../../edutech/frontend/src/services/connections-studentspace.ts#L42-L44) | Elimina una publicación guardada en el espacio personal |
| [`moveSavedPost`](../../edutech/frontend/src/services/connections-studentspace.ts#L46-L51) | Mueve una publicación guardada a otra carpeta |
| [`setPinned`](../../edutech/frontend/src/services/connections-studentspace.ts#L53-L58) | Fija o desfija una publicación guardada en el espacio personal |
| [`getPinnedPosts`](../../edutech/frontend/src/services/connections-studentspace.ts#L60-L61) | Obtiene todas las publicaciones fijadas por un usuario |
| [`getSpaceStats`](../../edutech/frontend/src/services/connections-studentspace.ts#L63-L64) | Obtiene estadísticas del espacio personal (número de carpetas y publicaciones guardadas) |
| [`batchDeleteItems`](../../edutech/frontend/src/services/connections-studentspace.ts#L66-L71) | Elimina múltiples carpetas y publicaciones guardadas en una sola operación |
| [`getSavedPostId`](../../edutech/frontend/src/services/connections-studentspace.ts#L73-L76) | Obtiene el identificador de guardado asociado a una publicación |

### Universidades y Carreras

| Función | Descripción |
| :--- | :--- |
| [`getUniversities`](../../edutech/frontend/src/services/connections-degrees.ts#L5-L15) | Obtiene la lista de universidades disponibles en el sistema |
| [`getYearById`](../../edutech/frontend/src/services/connections-degrees.ts#L17-L27) | Obtiene los detalles de un curso específico |
| [`getDegrees`](../../edutech/frontend/src/services/connections-degrees.ts#L29-L39) | Obtiene las carreras asociadas a una universidad |
| [`getMyDegrees`](../../edutech/frontend/src/services/connections-degrees.ts#L41-L50) | Obtiene las titulaciones asociadas al usuario autenticado |
| [`saveUserDegree`](../../edutech/frontend/src/services/connections-degrees.ts#L52-L67) | Guarda o actualiza las titulaciones asociadas a un estudiante |
| [`getDegreeName`](../../edutech/frontend/src/services/connections-degrees.ts#L69-L80) | Obtiene nombre de una carrera a partir de su identificador |
| [`getDegreeInfo`](../../edutech/frontend/src/services/connections-degrees.ts#L82-L93) | Obtiene el detalle de una carrera |

### Usuarios

| Función | Descripción |
| --- | --- |
| [`getUserByEmail`](../../edutech/frontend/src/services/connections-students.ts#L15-L24) | Obtiene un usuario a partir de su dirección de correo electrónico |
| [`getUserPhoto`](../../edutech/frontend/src/services/connections-students.ts#L26-L42) | Obtiene la foto de perfil de un usuario |
| [`postUser`](../../edutech/frontend/src/services/connections-students.ts#L44-L65) | Registra un nuevo usuario en el sistema |
| [`syncUser`](../../edutech/frontend/src/services/connections-students.ts#L67-L75) | Sincroniza el usuario con el backend y lo crea si no existe todavía |
| [`checkIsAdmin`](../../edutech/frontend/src/services/connections-students.ts#L77-L84) | Comprueba si el usuario autenticado tiene permisos de administrador |
| [`deleteUserAccount`](../../edutech/frontend/src/services/connections-students.ts#L86-L89) | Elimina permanentemente la cuenta del usuario del sistema |

### Interacción (likes, dislikes, comentarios)

| Función | Descripción |
| --- | --- |
| [`getComments`](../../edutech/frontend/src/services/interactions/connections-comments.ts#L4-L5) | Obtiene los comentarios de un recurso |
| [`postComment`](../../edutech/frontend/src/services/interactions/connections-comments.ts#L7-L12) | Publica un comentario en un recurso |
| [`getLikes`](../../edutech/frontend/src/services/interactions/connections-rating.ts#L5-L7) | Obtiene el estado de _like_ del usuario en un recurso y el recuento total de _likes_ |
| [`addLike`](../../edutech/frontend/src/services/interactions/connections-rating.ts#L8-L13) | Añade un _like_ a un recurso |
| [`removeLike`](../../edutech/frontend/src/services/interactions/connections-rating.ts#L15-L16) | Elimina un _like_ de un recurso |
| [`getDislikes`](../../edutech/frontend/src/services/interactions/connections-rating.ts#L18-L19) | Obtiene el estado de _dislike_ del usuario en un recurso y el recuento total de _dislikes_ |
| [`addDislike`](../../edutech/frontend/src/services/interactions/connections-rating.ts#L21-L26) | Añade un _dislike_ a un recurso |
| [`removeDislike`](../../edutech/frontend/src/services/interactions/connections-rating.ts#L28-L29) | Elimina un _dislike_ de un recurso |
| [`useLikeDislike`](../../edutech/frontend/src/services/interactions/connections-rating.ts#L31-L76) | Hook de React que gestiona el estado combinado de _like_ y _dislike_ para la interfaz |

### Suscripciones

| Función | Descripción |
| --- | --- |
| [`getSubscriptions`](../../edutech/frontend/src/services/connections-courses.ts#L18-L19) | Obtiene las suscripciones de un usuario |
| [`checkSubscription`](../../edutech/frontend/src/services/connections-courses.ts#L21-L28) | Verifica si el usuario está suscrito a una asignatura concreta |
| [`subscribeToCourse`](../../edutech/frontend/src/services/connections-courses.ts#L30-L37) | Suscribe al usuario a una asignatura |
| [`unsubscribe`](../../edutech/frontend/src/services/connections-courses.ts#L39-L42) | Cancela la suscripción del usuario a una asignatura |
