# Servicios

Durante este sprint, los servicios se separaron para evitar el alto acoplamiento y los cuellos de botella en los despliegues. Esto nos permite escalar cada componente de forma independiente y mejorar la estabilidad general del sistema. Los archivos se encuentra en la carpeta ([`service`](../../edutech/frontend/src/services/)).

## Funciones disponibles

### Años y cursos

| Función                                                                            | Descripción                                        |
| ---------------------------------------------------------------------------------- | -------------------------------------------------- |
| [`getYears`](../../edutech/frontend/src/services/connections-courses.ts#L3-L12)    | Obtiene los cursos académicos disponibles          |
| [`getCourses`](../../edutech/frontend/src/services/connections-courses.ts#L18-L32) | Obtiene las asignaturas de un curso y cuatrimestre |
| [`getCourse`](../../edutech/frontend/src/services/connections-courses.ts#L34-L43)  | Obtiene el detalle de una asignatura               |

### Contenido (publicaciones, documentos)

| Función                                                                                       | Descripción                                               |
| --------------------------------------------------------------------------------------------- | --------------------------------------------------------- |
| [`getPosts`](../../edutech/frontend/src/services/connections-documents.ts#L88-L98)            | Obtiene los documentos de una asignatura                  |
| [`getMyPosts`](../../edutech/frontend/src/services/connections-documents.ts#L82-L86)          | Obtiene los documentos que subió la cuenta                |
| [`getDocument`](../../edutech/frontend/src/services/connections-documents.ts#L113-L122)       | Obtiene un documento específico                           |
| [`getLinkDescarga`](../../edutech/frontend/src/services/connections-documents.ts#L79)         | Devuelve el enlace de descarga de un documento PDF        |
| [`getFilteredPosts`](../../edutech/frontend/src/services/connections-documents.ts#L100-L111)  | Obtiene documentos de una asignatura filtrados por título |
| [`postDocument`](../../edutech/frontend/src/services/connections-documents.ts#L124-L147)      | Publica un nuevo documento en una asignatura              |
| [`postQuiz`](../../edutech/frontend/src/services/connections-documents.ts#L149-L177)          | Publica un nuevo cuestionario en una asignatura           |
| [`postFlashCardDeck`](../../edutech/frontend/src/services/connections-documents.ts#L179-L204) | Publica una nuevo flashcard en una asignatura             |
| [`checkQuizAnswers`](../../edutech/frontend/src/services/connections-documents.ts#L206-L219)  | Comprueba la respuesta del cuestionario                   |

### Borradores

| Función                                                                                  | Descripción                                                          |
| ---------------------------------------------------------------------------------------- | -------------------------------------------------------------------- |
| [`getDraft`](../../edutech/frontend/src/services/connections-documents.ts#L252-L261)     | Obtiene un borrado de un usuario                                     |
| [`getDrafts`](../../edutech/frontend/src/services/connections-documents.ts#L263-L271)    | Obtiene una lista de borradores de un usuario                        |
| [`saveDraft`](../../edutech/frontend/src/services/connections-documents.ts#L274-L296)    | Crear un borrador, sirviendo para Cuestionarios como Flashcards      |
| [`updateDraft`](../../edutech/frontend/src/services/connections-documents.ts#L298-L324)  | Actualizar un borrador, sirviendo para Cuestionarios como Flashcards |
| [`uploadPDFDraft`](../../edutech/frontend/src/services/connections-documents.ts#326-352) | Sube un documento y manda su vectorización                           |
| [`deleteDraft`](../../edutech/frontend/src/services/connections-documents.ts#L354-L362)  | Elimina el borrado del usuario                                       |

### Inteligencia Artificial

| Función                                                                                            | Descripción                                                                |
| -------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------- |
| [`askChatbot`](../../edutech/frontend/src/services/onnections-documents.ts#L377-L401)              | Permite a los estudiante consultar al chatbot, soportando disitnos modelos |
| [`connectToDocumentStatus`](../../edutech/frontend/src/services/onnections-documents.ts#L404-L417) | Comprueba los estados de la vectorizaciónde los archivos.                  |

### Reportes y Moderación

| Función                                                                                    | Descripción                                                                                           |
| ------------------------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------- |
| [`getReportReasons`](../../edutech/frontend/src/services/connections-reports.js#L21-30)    | Obtiene la lista de motivos predefinidos disponibles para realizar un reporte                         |
| [`checkUserReport`](../../edutech/frontend/src/services/connections-reports.js#L73-82)     | Verifica si un usuario ya ha reportado previamente una publicación específica                         |
| [`createReport`](../../edutech/frontend/src/services/connections-reports.js#L32-45)        | Envía un nuevo reporte asociado a una publicación (documento, cuestionario, etc.)                     |
| [`createCommentReport`](../../edutech/frontend/src/services/connections-reports.js#L84-97) | Envía un nuevo reporte asociado específicamente a un comentario                                       |
| [`getReports`](../../edutech/frontend/src/services/connections-reports.js#L48-57)          | Obtiene la lista general de reportes registrados (requiere permisos de administrador)                 |
| [`rejectPostReports`](../../edutech/frontend/src/services/connections-reports.js#L59-71)   | Descarta o elimina los reportes asociados a una publicación (requiere permisos de administrador)      |
| [`resolveReport`](../../edutech/frontend/src/services/connections-reports.js#L99-115)      | Resuelve un reporte activo, permitiendo adjuntar un mensaje de resolución y una imagen como evidencia |

### Sesiones de estudio

| Función                                                                                               | Descripción                                                                                               |
| :---------------------------------------------------------------------------------------------------- | :-------------------------------------------------------------------------------------------------------- |
| [`getStudySessions`](../../edutech/frontend/src/services/connections-study-sessions.js#L21-42)        | Obtiene la lista de sesiones de estudio, permitiendo filtrar por cursos, estudiante o si están destacadas |
| [`getStudySession`](../../edutech/frontend/src/services/connections-study-sessions.js#L44-49)         | Obtiene los detalles específicos de una sesión de estudio                                                 |
| [`createStudySession`](../../edutech/frontend/src/services/connections-study-sessions.js#L51-68)      | Crea y programa una nueva sesión de estudio asociada a un curso                                           |
| [`deleteStudySession`](../../edutech/frontend/src/services/connections-study-sessions.js#L70-73)      | Elimina una sesión de estudio existente del sistema                                                       |
| [`starStudySession`](../../edutech/frontend/src/services/connections-study-sessions.js#L75-82)        | Permite a un estudiante unirse o marcar como destacada una sesión de estudio                              |
| [`unstarStudySession`](../../edutech/frontend/src/services/connections-study-sessions.js#L84-90)      | Permite a un estudiante abandonar o quitar de sus destacadas una sesión de estudio                        |
| [`getStudySessionComments`](../../edutech/frontend/src/services/connections-study-sessions.js#L92-96) | Obtiene el historial de comentarios asociados a una sesión de estudio                                     |
| [`addStudySessionComment`](../../edutech/frontend/src/services/connections-study-sessions.js#L98-109) | Publica un nuevo comentario dentro de una sesión de estudio                                               |

### Universidades y Carreras

| Función                                                                                   | Descripción                                                                                             |
| :---------------------------------------------------------------------------------------- | :------------------------------------------------------------------------------------------------------ |
| [`getUniversities`](../../edutech/frontend/src/services/connections-degrees.js#L1-11)     | Obtiene la lista de universidades disponibles en el sistema                                             |
| [`getYearById`](../../edutech/frontend/src/services/connections-degrees.js#L13-23)        | Obtiene los detalles de un año académico específico mediante su identificador                           |
| [`getDegrees`](../../edutech/frontend/src/services/connections-degrees.js#L25-35)         | Obtiene las carreras o grados asociados a una universidad específica                                    |
| [`getDegreesByUserId`](../../edutech/frontend/src/services/connections-degrees.js#L37-47) | Obtiene la carrera o programa académico al que pertenece un estudiante                                  |
| [`saveUserDegree`](../../edutech/frontend/src/services/connections-degrees.js#L49-65)     | Guarda o actualiza la carrera seleccionada en el perfil de un estudiante                                |
| [`getDegreeName`](../../edutech/frontend/src/services/connections-degrees.js#L67-78)      | Obtiene únicamente el nombre de una carrera a partir de su identificador                                |
| [`getDegreeInfo`](../../edutech/frontend/src/services/connections-degrees.js#L80-91)      | Obtiene la información general de una carrera, incluyendo su nombre y la universidad a la que pertenece |

### Usuarios

| Función                                                                                 | Descripción                                                       |
| --------------------------------------------------------------------------------------- | ----------------------------------------------------------------- |
| [`syncUser`](../../edutech/frontend/src/services/connections-students.ts#L85-L93)       | Sincroniza el usuario con el backend; lo crea si no existe        |
| [`postUser`](../../edutech/frontend/src/services/connections-students.ts#L59-L83)       | Registra un nuevo usuario en el sistema                           |
| [`getUserPhoto`](../../edutech/frontend/src/services/connections-students.ts#L33-L57)   | Obtiene la foto de perfil del usuario desde Microsoft             |
| [`getUserByEmail`](../../edutech/frontend/src/services/connections-students.ts#L20-L31) | Obtiene un usuario a partir de su dirección de correo electrónico |

### Interacción (likes, dislikes, comentarios)

| Función                                                                            | Descripción                                                                                             |
| ---------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------- |
| [`getComments`](../../edutech/frontend/src/services/connections-documents.ts#L223) | Obtiene los comentarios de un documento                                                                 |
| [`postComment`](../../edutech/frontend/src/services/connections-documents.ts#L234) | Publica un comentario en un documento                                                                   |
| [`getLikes`](../../edutech/frontend/src/services/useLikeDislike.js#L3-L7)          | Obtiene el estado de _like_ de un usuario en un documento y la cuenta de _likes_ de ese documento       |
| [`addLike`](../../edutech/frontend/src/services/useLikeDislike.js#L9-L13)          | Añade un _like_ a un documento (elimina el _dislike_ si existe)                                         |
| [`removeLike`](../../edutech/frontend/src/services/useLikeDislike.js#L15-L18)      | Elimina un _like_ de un documento                                                                       |
| [`getDislikes`](../../edutech/frontend/src/services/useLikeDislike.js#L20-L24)     | Obtiene el estado de _dislike_ de un usuario en un documento y la cuenta de _dislikes_ de ese documento |
| [`addDislike`](../../edutech/frontend/src/services/useLikeDislike.js#L26-L30)      | Añade un _dislike_ a un documento (elimina el _like_ si existe)                                         |
| [`removeDislike`](../../edutech/frontend/src/services/useLikeDislike.js#L32-L35)   | Elimina un _dislike_ de un documento                                                                    |

### Suscripciones

| Función                                                                                   | Descripción                                           |
| ----------------------------------------------------------------------------------------- | ----------------------------------------------------- |
| [`getSubscriptions`](../../edutech/frontend/src/services/connections-courses.ts#L45-L54)  | Obtiene el detalle de una subscripción                |
| [`checkSubscription`](../../edutech/frontend/src/services/connections-courses.ts#L56-L66) | Verifica si el usuario está suscrito a una asignatura |
| [`subscribeToCourse`](../../edutech/frontend/src/services/connections-courses.ts#L68-L80) | Suscribe al usuario a una asignatura                  |
| [`unsubscribe`](../../edutech/frontend/src/services/connections-courses.ts#L34-L43)       | Cancela la suscripción                                |
