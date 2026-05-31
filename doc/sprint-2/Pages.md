# Páginas

A continuación, se detallan todas las páginas implementadas en el desarrollo de esta aplicación.

---

## Autenticación y Configuración

| Página | Descripción | Imagen |
| --- | --- | --- |
| [SignIn](../../edutech/frontend/src/pages/SignIn.tsx) | Pantalla de inicio de sesión con autenticación de Microsoft | ![signin.png](./pages/signin.png) |
| [SelectDegree](../../edutech/frontend/src/pages/SelectDegree.tsx) | Selección  de universidad y carrera tras registrarse por primera vez | ![selectdegree.png](./pages/selectdegree.png) |

---

## Navegación Académica

| Página | Descripción | Imagen |
| --- | --- | --- |
| [YearsPage](../../edutech/frontend/src/pages/YearsPage.tsx) | Vista de los cursos disponibles para el estudiante según sus titulaciones | ![allcourses.png](./pages/allcourses.png) |
| [CoursesPage](../../edutech/frontend/src/pages/CoursesPage.tsx) | Asignaturas de un curso, organizadas por cuatrimestre | ![allsubjects.png](./pages/allsubjects.png) |
| [CourseDetail](../../edutech/frontend/src/pages/CourseDetail.tsx) | Vista de una asignatura con todos sus recursos publicados | ![subjectdetail.png](./pages/subjectdetail.png) |
| [MyCourses](../../edutech/frontend/src/pages/MyCourses.tsx) | Listado de las asignaturas a las que el estudiante está suscrito | ![mycourses.png](./pages/mycourses.png) |

---

## Visualización de Contenido

| Página | Descripción | Imagen |
| --- | --- | --- |
| [DocumentPreview](../../edutech/frontend/src/pages/DocumentPreview.tsx) | Visualización de documentos PDF con posibilidad de descarga | ![vistapreviadoc.png](./pages/vistapreviadoc.png) |
| [VideoPreview](../../edutech/frontend/src/pages/VideoPreview.tsx) | Visualización de vídeos | ![vistapreviavid.png](./pages/vistapreviavid.png) |
| [TakeFlashCard](../../edutech/frontend/src/pages/TakeFlashCard.tsx) | Modo de estudio de flashcards | ![vistapreviaFlashcard.png](./pages/vistapreviaFlashcard.png) |
| [TakeQuiz](../../edutech/frontend/src/pages/TakeQuiz.tsx) | Realización de un cuestionario con corrección automática | ![vistapreviacuestionarios.png](./pages/vistapreviacuestionarios.png) |

---

## Publicación de Contenido

| Página | Descripción | Imagen |
| --- | --- | --- |
| [UploadDocument](../../edutech/frontend/src/pages/UploadDocument.tsx) | Formulario para publicar un documento PDF en una asignatura | ![cargarpublicacionpdf.png](./pages/cargarpublicacionpdf.png) |
| [LoadVideoPost](../../edutech/frontend/src/pages/LoadVideoPost.tsx) | Formulario para publicar un vídeo de YouTube en una asignatura | ![cargarpublicacionvid.png](./pages/cargarpublicacionvid.png) |
| [CreateFlashCard](../../edutech/frontend/src/pages/CreateFlashCard.tsx) | Formulario para crear y publicar un grupo de tarjetas de estudio en una asignatura | ![cargarpublicacionflashcard.png](./pages/cargarpublicacionflashcard.png) |
| [CreateQuiz](../../edutech/frontend/src/pages/CreateQuiz.tsx) | Formulario para crear y publicar un cuestionario en una asignatura | ![CargarPublicacionCuestionario.png](./pages/CargarPublicacionCuestionario.png) |

---

## Gestión de Contenido

| Página | Descripción | Imagen |
| --- | --- | --- |
| [Drafts](../../edutech/frontend/src/pages/Drafts.tsx) | Listado de borradores guardados por el estudiante pendientes de publicar | ![drafts.png](./pages/drafts.png) |
| [MyDocuments](../../edutech/frontend/src/pages/MyDocuments.tsx) | Listado de todos los recursos publicados por el  estudiante | ![mydocuments.png](./pages/mydocuments.png) |
| [MySpace](../../edutech/frontend/src/pages/MySpace.tsx) | Espacio personal del estudiante para organizar y guardar publicaciones en carpetas | ![myspace.png](./pages/myspace.png) |

---

## Perfil de Usuario

| Página | Descripción | Imagen |
| --- | --- | --- |
| [ProfilePage](../../edutech/frontend/src/pages/ProfilePage.tsx) | Perfil del estudiante con configuraciones particulares de la cuenta | ![profilepage.png](./pages/profilepage.png) |

---

## Reportes y Moderación

| Página | Descripción | Imagen |
| --- | --- | --- |
| [ReportFormPage](../../edutech/frontend/src/pages/ReportFormPage.tsx) | Formulario para reportar un contenido o comentario inapropiado | ![reportformpage.png](./pages/reportformpage.png) |
| [ReportsPage](../../edutech/frontend/src/pages/ReportsPage.tsx) | Panel de administración con los reportes pendientes de resolución | ![reportspage.png](./pages/reportspage.png) |
| [RevisionPage](../../edutech/frontend/src/pages/RevisionPage.tsx) | Panel de revisión de documentos PDF revisados por la IA y pendientes de aprobación por el administrador | ![revisionpage.png](./pages/revisionpage.png) |

---

## Sesiones de Estudio

| Página | Descripción | Imagen |
| --- | --- | --- |
| [StudySessions](../../edutech/frontend/src/pages/StudySessions.tsx) | Listado de sesiones de estudio disponibles con filtros por asignatura y fecha | ![studysessions.png](./pages/studysessions.png) |
| [StudySessionDetail](../../edutech/frontend/src/pages/StudySessionDetail.tsx) | Detalle de una sesión de estudio con participantes, comentarios y acceso al stream | ![studysessiondetail.png](./pages/studysessiondetail.png) |
| [SessionLive](../../edutech/frontend/src/pages/SessionLive.tsx) | Vista en directo de una sesión de estudio con stream de Twitch y chat en tiempo real | ![sessionlive.png](./pages/sessionlive.png) |
