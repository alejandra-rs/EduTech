# Componentes

A continuación, se detallan todos los componentes implementados en el desarrollo de esta aplicación.

---

## Navegación y Layout

| Componente | Descripción | Imagen |
| --- | --- | --- |
| [Layout](../../edutech/frontend/src/components/Layout.tsx) | Estructura principal de la aplicación que envuelve el contenido con el header | ![layout.png](./components/layout.png) |
| [Header](../../edutech/frontend/src/components/Header.tsx) | Barra lateral de navegación con acceso al perfil y secciones principales | ![header.png](./components/header.png) |
| [HamburgerButton](../../edutech/frontend/src/components/HamburgerButton.tsx) | Botón para expandir o contraer el header | ![hamburger.png](./components/hamburger.png) |
| [TitlePage](../../edutech/frontend/src/components/TitlePage.tsx) | Cabecera de página con título y botón de retorno | ![titlepage.png](./components/titlepage.png) |

## Contenido

| Componente | Descripción | Imagen |
| --- | --- | --- |
| [PostCard](../../edutech/frontend/src/components/PostCard.tsx) | Tarjeta que representa un recurso individual mostrando su información básica | ![postcard.png](./components/postcard.png) |
| [PostGrid](../../edutech/frontend/src/components/PostGrid.tsx) | Layout que organiza múltiples tarjetas de recursos en formato responsive | ![postgrid.png](./components/postgrid.png) |
| [Preview](../../edutech/frontend/src/components/post-preview/preview.tsx) | Miniatura de una publicación según su tipo (PDF, vídeo, flashcard o cuestionario) | ![preview.png](./components/preview.png) |
| [PostLabel](../../edutech/frontend/src/components/post-preview/labels.tsx) | Etiqueta que identifica el formato de una publicación | ![postlabel.png](./components/postlabel.png) |
| [IAtag](../../edutech/frontend/src/components/IAtag.tsx) | Etiqueta visual que indica que un recurso ha sido generado o procesado por IA | ![iatag.png](./components/iatag.png) |


## Cursos y Asignaturas

| Componente | Descripción | Imagen |
| --- | --- | --- |
| [YearWidget](../../edutech/frontend/src/components/YearWidget.tsx) | Widget que representa a un año académico | ![yearwidget.png](./components/yearwidget.png)
| [CourseWidget](../../edutech/frontend/src/components/CourseWidget.tsx) | Widget que representa a una asignatura y la suscripción asociada a ella | ![coursewidget.png](./components/coursewidget.png) |
| [Quarter](../../edutech/frontend/src/components/Quarter.tsx) | Contenedor de asignaturas pertenecientes a un mismo cuatrimestre | ![quarter.png](./components/quarter.png) |
| [BellButton](../../edutech/frontend/src/components/interactions/BellButton.tsx) | Botón de suscripción o anulación de suscripción a una asignatura | ![bellbutton.png](./components/bellbutton.png) |

## Interacción y Feedback

| Componente | Descripción | Imagen |
| --- | --- | --- |
| [ReactionButton](../../edutech/frontend/src/components/interactions/ReactionButton.tsx) | Botón individual de like o dislike sobre un recurso | ![reactionbutton.png](./components/reactionbutton.png) |
| [ReactionsContainer](../../edutech/frontend/src/components/interactions/ReactionsContainer.tsx) | Contenedor que agrupa los botones de like y dislike con sus contadores | ![reactioncontainer.png](./components/reactioncontainer.png) |
| [Views](../../edutech/frontend/src/components/interactions/Views.tsx) | Contador de visualizaciones de un recurso | ![views.png](./components/views.png) |
| [Comment](../../edutech/frontend/src/components/interactions/Comment.tsx) | Representación de un comentario con autor, fecha y contenido | ![comentario.png](./components/comentario.png) |
| [CommentModal](../../edutech/frontend/src/components/interactions/CommentModal.tsx) | Modal para añadir un nuevo comentario a un recurso o sesión de estudio | ![popup.png](./components/popup.png) |
| [CommentsSection](../../edutech/frontend/src/components/interactions/CommentsSection.tsx) | Sección que lista todos los comentarios asociados a un recurso | ![commentssection.png](./components/commentssection.png) |

## Formularios y Entrada de Datos

| Componente | Descripción | Imagen |
| --- | --- | --- |
| [Input](../../edutech/frontend/src/components/Input.tsx) | Campo personalizado para la entrada de datos | ![input.png](./components/input.png) |
| [SearchBar](../../edutech/frontend/src/components/SearchBar.tsx) | Barra de búsqueda de contenido | ![searchbar.png](./components/searchbar.png) |
| [Tabs](../../edutech/frontend/src/components/Tabs.tsx) | Filtro por tipo de contenido (PDF, vídeo, flashcard, cuestionario) | ![tabs.png](./components/tabs.png) |


## Publicación de Contenido

| Componente | Descripción | Imagen |
| --- | --- | --- |
| [Footer](../../edutech/frontend/src/components/Footer.tsx) | Navegación inferior para publicar distintos tipos de material | ![footer.png](./components/footer.png) |
| [FormSteps](../../edutech/frontend/src/components/forms-components/FormSteps.tsx) | Estructura de formulario para publicar documentos PDF | ![formsteps.png](./components/formsteps.png) |
| [StageList](../../edutech/frontend/src/components/forms-components/StageList.tsx) | Listado de las etapas del formulario de publicación de PDF | ![stagelist.png](./components/stagelist.png) |
| [ProgressBar](../../edutech/frontend/src/components/forms-components/ProgressBar.tsx) | Barra de progreso para las tareas en la publicación de un PDF | ![progressbar.png](./components/progressbar.png) |
| [UploadDropzone](../../edutech/frontend/src/components/forms-components/UploadDropzone.tsx) | Zona para subir un PDF o imagen, previsualizándolo | ![uploaddropzone.png](./components/uploaddropzone.png) |
| [UrlPreview](../../edutech/frontend/src/components/forms-components/UrlPreview.tsx) | Vista previa del vídeo a partir de la URL introducida | ![urlpreview.png](./components/urlpreview.png) |
| [UploadMenuButton](../../edutech/frontend/src/components/UploadMenuButton.tsx) | Desplegable para seleccionar la publicación de un contenido | ![uploadmenubutton.png](./components/uploadmenubutton.png) |

## Visualización de Contenido

| Componente | Descripción | Imagen |
| --- | --- | --- |
| [PDFViewer](../../edutech/frontend/src/components/PDFViewer.tsx) | Visor de documentos PDF | ![visorpdf.png](./components/visorpdf.png) |
| [VideoViewer](../../edutech/frontend/src/components/VideoViewer.tsx) | Reproductor de vídeos (embed de YouTube) | ![visorvideo.png](./components/visorvideo.png) |
| [DownloadButton](../../edutech/frontend/src/components/DownloadButton.tsx) | Botón para descargar un documento PDF | ![descargar.png](./components/descargar.png) |
| [DocumentInfo](../../edutech/frontend/src/components/DocumentInfo.tsx) | Panel con la información de un documento PDF | ![documentinfo.png](./components/documentinfo.png) |

## Usuario

| Componente | Descripción | Imagen |
| --- | --- | --- |
| [UserAvatar](../../edutech/frontend/src/components/UserAvatar.tsx) | Avatar del usuario con su imagen de perfil o un placeholder por defecto | ![useravatar.png](./components/useravatar.png) |
| [TwitchConnectButton](../../edutech/frontend/src/components/TwitchConnectButton.tsx) | Botón para iniciar el flujo OAuth de conexión con la cuenta de Twitch | ![twitchconnectbutton.png](./components/twitchconnectbutton.png) |

## Selección de Titulación

| Componente | Descripción | Imagen |
| --- | --- | --- |
| [SelectUniversity](../../edutech/frontend/src/components/degree-selection/SelectUniversity.tsx) | Desplegable para elegir la universidad del estudiante | ![selectuniversity.png](./components/selectuniversity.png) |
| [SelectionGrid](../../edutech/frontend/src/components/degree-selection/SelectionGrid.tsx) | Cuadrícula para seleccionar la carrera dentro de una universidad | ![selectiongrid.png](./components/selectiongrid.png) |
| [ButtonControl](../../edutech/frontend/src/components/degree-selection/ButtonControl.tsx) | Controles de navegación (atrás / guardar) del flujo de selección de titulación | ![buttoncontrol.png](./components/buttoncontrol.png) |

## Editor de Material de Estudio

| Componente | Descripción | Imagen |
| --- | --- | --- |
| [EditorLayout](../../edutech/frontend/src/components/study-material/EditorLayout.tsx) | Estructura principal del editor, gestiona el guardado automático y la navegación | ![editorlayout.png](./components/editorlayout.png) |
| [EditorHeader](../../edutech/frontend/src/components/study-material/EditorHeader.tsx) | Cabecera del editor con título editable y botones de guardar o publicar | ![editorheader.png](./components/editorheader.png) |
| [EditorSidebar](../../edutech/frontend/src/components/study-material/EditorSidebar.tsx) | Panel lateral del editor con el listado de _flashcards_ o preguntas creadas | ![editorsidebar.png](./components/editorsidebar.png) |
| [AddItemButton](../../edutech/frontend/src/components/study-material/AddItemButton.tsx) | Botón para añadir una nueva tarjeta o pregunta al formulario | ![additembutton.png](./components/additembutton.png) |
| [ConfirmModal](../../edutech/frontend/src/components/study-material/ConfirmModal.tsx) | Modal de confirmación para acciones destructivas | ![confirmmodal.png](./components/confirmmodal.png) |

## Flashcards

| Componente | Descripción | Imagen |
| --- | --- | --- |
| [FlashCardView](../../edutech/frontend/src/components/study-material/flashcards/FlashCardView.tsx) | Vista principal del modo de estudio de flashcards | ![flashcardview.png](./components/flashcardview.png) |
| [FlashCardItem](../../edutech/frontend/src/components/study-material/flashcards/FlashCardItem.tsx) | Tarjeta individual con pregunta y respuesta | ![flashcarditem.png](./components/flashcarditem.png) |
| [CardCarousel](../../edutech/frontend/src/components/study-material/flashcards/CardCarousel.tsx) | Carrusel para navegar entre las _flashcards_ del grupo | ![cardcarousel.png](./components/cardcarousel.png) |

## Cuestionarios

Componentes utilizados en el modo de realización de cuestionarios.

| Componente | Descripción | Imagen |
| --- | --- | --- |
| [QuizCard](../../edutech/frontend/src/components/study-material/quiz/QuizCard.tsx) | Pregunta del cuestionario con sus respuestas | ![quizcard.png](./components/quizcard.png) |
| [QuizQuestion](../../edutech/frontend/src/components/study-material/quiz/QuizQuestion.tsx) | Enunciado de una pregunta del cuestionario | ![quizquestion.png](./components/quizquestion.png) |
| [QuizAnswer](../../edutech/frontend/src/components/study-material/quiz/QuizAnswer.tsx) | Respuesta seleccionable con indicador de acierto o error | ![quizanswer.png](./components/quizanswer.png) |

## Estudio

| Componente | Descripción | Imagen |
| --- | --- | --- |
| [StudyHeader](../../edutech/frontend/src/components/study-material/StudyHeader.tsx) | Cabecera con botón de retorno y título | ![studyheader.png](./components/studyheader.png) |
| [StudyProgressBar](../../edutech/frontend/src/components/study-material/StudyProgressBar.tsx) | Barra de progreso que indica cuántas tarjetas se han completado | ![studyprogressbar.png](./components/studyprogressbar.png) |
| [StudySidebar](../../edutech/frontend/src/components/study-material/StudySidebar.tsx) | Panel lateral con el índice de tarjetas o preguntas | ![studysidebar.png](./components/studysidebar.png) |
| [Stats](../../edutech/frontend/src/components/study-material/Stats.tsx) | Panel de resultados con el número de respuestas correctas e incorrectas | ![stats.png](./components/stats.png) |
| [CompletionBanner](../../edutech/frontend/src/components/study-material/CompletionBanner.tsx) | Resumen del resultado del estudio | ![completionbanner.png](./components/completionbanner.png) |

## Chatbot

| Componente | Descripción | Imagen |
| --- | --- | --- |
| [ChatbotWidget](../../edutech/frontend/src/components/chatbot/ChatbotWidget.tsx) | Interfaz completa del chatbot, integra cabecera, mensajes y campo de entrada | ![chatbotwidget.png](./components/chatbotwidget.png) |
| [ChatbotHeader](../../edutech/frontend/src/components/chatbot/ChatbotHeader.tsx) | Cabecera del widget del chatbot con controles de modo (razonamiento profundo, herramientas) | ![chatbotheader.png](./components/chatbotheader.png) |
| [ChatbotMessageBox](../../edutech/frontend/src/components/chatbot/ChatbotMessageBox.tsx) | Contenedor que muestra el historial de la conversación con el chatbot | ![chatbotmessagebox.png](./components/chatbotmessagebox.png) |
| [ChatbotMessage](../../edutech/frontend/src/components/chatbot/ChatbotMessage.tsx) | Burbuja individual de mensaje del chatbot o del usuario | ![chatbotmessage.png](./components/chatbotmessage.png) |
| [ChatbotFooterInput](../../edutech/frontend/src/components/chatbot/ChatbotFooterInput.tsx) | Campo de entrada para enviar consultas al chatbot | ![chatbotfooter.png](./components/chatbotfooter.png) |
| [DocumentMentionList](../../edutech/frontend/src/components/chatbot/DocumentMentionList.tsx) | Lista de autocompletado para mencionar documentos dentro del chatbot | ![documentmentionlist.png](./components/documentmentionlist.png) |

## Mi Espacio

Componentes del espacio personal del estudiante para organizar y guardar publicaciones en carpetas.

| Componente | Descripción | Imagen |
| --- | --- | --- |
| [SavedGrid](../../edutech/frontend/src/components/my-space/SavedGrid.tsx) | Cuadrícula que muestra las publicaciones guardadas por el usuario | ![savedgrid.png](./components/savedgrid.png) |
| [SavedPreview](../../edutech/frontend/src/components/my-space/SavedPreview.tsx) | Tarjeta de vista previa de una publicación guardada | ![savedpreview.png](./components/savedpreview.png) |
| [FolderCard](../../edutech/frontend/src/components/my-space/FolderCard.tsx) | Tarjeta que representa una carpeta con su nombre y acciones asociadas | ![foldercard.png](./components/foldercard.png) |
| [FolderSection](../../edutech/frontend/src/components/my-space/FolderSection.tsx) | Sección que lista las carpetas del usuario | ![foldersection.png](./components/foldersection.png) |
| [FolderPath](../../edutech/frontend/src/components/my-space/FolderPath.tsx) | Ruta de navegación dentro de las carpetas | ![folderpath.png](./components/folderpath.png) |
| [DroppablePath](../../edutech/frontend/src/components/my-space/DroppablePath.tsx) | Segmento de la ruta de carpeta que acepta elementos arrastrados para moverlos | ![droppablepath.png](./components/droppablepath.png) |
| [FolderInlineEditor](../../edutech/frontend/src/components/my-space/FolderInlineEditor.tsx) | Editor en línea para renombrar una carpeta directamente desde la tarjeta | ![folderinlineeditor.png](./components/folderinlineeditor.png) |
| [FolderEditorCell](../../edutech/frontend/src/components/my-space/FolderEditorCell.tsx) | Celda editable dentro del editor de carpetas | ![foldereditor.png](./components/foldereditor.png) |
| [PinnedSection](../../edutech/frontend/src/components/my-space/PinnedSection.tsx) | Sección que muestra las publicaciones fijadas por el usuario | ![pinnedsection.png](./components/pinnedsection.png) |
| [PinnedButton](../../edutech/frontend/src/components/my-space/PinnedButton.tsx) | Botón para fijar o desfijar una publicación guardada | ![pinnedbutton.png](./components/pinnedbutton.png) |
| [SaveButton](../../edutech/frontend/src/components/my-space/SaveButton.tsx) | Botón para guardar una publicación en una carpeta del espacio personal | ![savebutton.png](./components/savebutton.png) |
| [SectionTitle](../../edutech/frontend/src/components/my-space/SectionTitle.tsx) | Encabezado de sección con título y acciones opcionales | ![sectiontitle.png](./components/sectiontitle.png) |
| [SelectionButtonsGroup](../../edutech/frontend/src/components/my-space/SelectionButtonsGroup.tsx) | Grupo de botones de acción masiva (mover, eliminar) en modo selección | ![selectionbuttonsgroup.png](./components/selectionbuttonsgroup.png) |
| [SelectionIndicator](../../edutech/frontend/src/components/my-space/SelectionIndicator.tsx) | Indicador visual de selección sobre una tarjeta de carpeta o publicación | ![selectionindicator.png](./components/selectionindicator.png) |
| [DeleteUndoToast](../../edutech/frontend/src/components/my-space/DeleteUndoToast.tsx) | Notificación con opción de deshacer la eliminación de un elemento | ![deleteundotoast.png](./components/deleteundotoast.png) |

## Reportes

| Componente | Descripción | Imagen |
| --- | --- | --- |
| [ReportButton](../../edutech/frontend/src/components/reports/ReportButton.tsx) | Botón para iniciar el flujo de reporte de una publicación o comentario | ![reportbutton.png](./components/reportbutton.png) |
| [ReportPopup](../../edutech/frontend/src/components/reports/ReportPopup.tsx) | Modal para seleccionar el motivo y enviar un reporte | ![reportpopup.png](./components/reportpopup.png) |
| [DocumentReport](../../edutech/frontend/src/components/reports/DocumentReport.tsx) | Tarjeta con el detalle de un reporte pendiente de revisión | ![documentreport.png](./components/documentreport.png) |
| [AdminWidget](../../edutech/frontend/src/components/reports/AdminWidget.tsx) | Widget de administrador con las acciones disponibles sobre un reporte | ![adminwidget.png](./components/adminwidget.png) |
| [ActionButton](../../edutech/frontend/src/components/reports/ActionButton.tsx) | Botón de acción de administrador con paso de confirmación integrado | ![actionbutton.png](./components/actionbutton.png) |

## Sesiones de Estudio

| Componente | Descripción | Imagen |
| --- | --- | --- |
| [SessionItem](../../edutech/frontend/src/components/study-sessions/SessionItem.tsx) | Elemento de lista que representa una sesión de estudio con sus datos principales | ![sessionitem.png](./components/sessionitem.png) |
| [SessionHeader](../../edutech/frontend/src/components/study-sessions/SessionHeader.tsx) | Cabecera de la vista de detalle de una sesión de estudio | ![sessionheader.png](./components/sessionheader.png) |
| [SessionDescription](../../edutech/frontend/src/components/study-sessions/SessionDescription.tsx) | Sección con la descripción completa de una sesión de estudio | ![sessiondescription.png](./components/sessiondescription.png) |
| [SessionStatusBadge](../../edutech/frontend/src/components/study-sessions/SessionStatusBadge.tsx) | Indicador de estado de una sesión (próxima, en curso, finalizada) | ![sessionstatusbadge.png](./components/sessionstatusbadge.png) |
| [ParticipateButton](../../edutech/frontend/src/components/study-sessions/ParticipateButton.tsx) | Botón para unirse o abandonar una sesión de estudio | ![participatebutton.png](./components/participatebutton.png) |
| [CreateSessionModal](../../edutech/frontend/src/components/study-sessions/CreateSessionModal.tsx) | Modal para crear una nueva sesión de estudio con fecha, asignatura y descripción | ![createsessionmodal.png](./components/createsessionmodal.png) |
| [CalendarWidget](../../edutech/frontend/src/components/study-sessions/CalendarWidget.tsx) | Selector de fecha para filtrar sesiones de estudio | ![calendarwidget.png](./components/calendarwidget.png) |
| [SubjectDropdown](../../edutech/frontend/src/components/study-sessions/SubjectDropdown.tsx) | Desplegable para filtrar sesiones o seleccionar asignatura al crear una sesión | ![subjectdropdown.png](./components/subjectdropdown.png) |
| [StreamButton](../../edutech/frontend/src/components/study-sessions/StreamButton.tsx) | Botón para iniciar o detener la emisión en vivo de una sesión | ![streambutton.png](./components/streambutton.png) |
| [StreamPlayer](../../edutech/frontend/src/components/study-sessions/live/StreamPlayer.tsx) | Reproductor embebido del stream de Twitch activo en una sesión | ![streamplayer.png](./components/streamplayer.png) |
| [LiveChatPanel](../../edutech/frontend/src/components/study-sessions/live/LiveChatPanel.tsx) | Panel de chat en tiempo real para la comunicación durante la sesión en vivo | ![livechatpanel.png](./components/livechatpanel.png) |


## Miscelánea

| Componente | Descripción | Imagen |
| --- | --- | --- |
| [DraftCard](../../edutech/frontend/src/components/DraftCard.tsx) | Representa un borrador guardado | ![draftcard.png](./components/draftcard.png) |
| [SuccessToast](../../edutech/frontend/src/components/SuccessToast.tsx) | Notificación que confirma que una operación se ha realizado con éxito | ![successtoast.png](./components/successtoast.png) |
| [LoadInformation](../../edutech/frontend/src/components/LoadInformation.tsx) | Estado de carga que se muestra mientras se obtiene información del servidor | ![loadinformation.png](./components/loadinformation.png) |
