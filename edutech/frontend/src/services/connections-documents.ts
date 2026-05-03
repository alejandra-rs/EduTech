import { PostPreview, PostPDF, PostVideo, PostQuiz, PostFlashcard } from '../models/post.model';
import { Student } from '../models/student.model';

// ── Local types ───────────────────────────────────────────────────────────────

export type PostType = 'PDF' | 'VID' | 'QUI' | 'FLA';

export interface Comment {
  id: number;
  message: string;
  user: Student;
  created_at: string;
}

export interface LikeStatus {
  id: number;
  count: number;
}

export interface QuizAnswer {
  text: string;
  isCorrect: boolean;
}

export interface QuizQuestion {
  title: string;
  answers: QuizAnswer[];
}

export interface FlashCard {
  question: string;
  answer: string;
}

export interface Draft {
  id: number;
  title: string;
  description: string;
  post_type: PostType;
  student: number;
  course: number;
  cards?: Array<{ question: string; answer: string }>;
  questions?: Array<{ title: string; answers: Array<{ text: string; is_correct: boolean }> }>;
}

export interface QuizCheckResponse {
  score: number;
  results: Array<{ answer_id: number; is_correct: boolean }>;
}

// ── Helpers ───────────────────────────────────────────────────────────────────

const TYPE_MAP = {
  PDF: 'pdf',
  VID: 'video',
  QUI: 'cuestionario',
  FLA: 'flashcard',
} as const;

function _withExtendedType(post: any): PostPreview {
  return { ...post, extendedType: TYPE_MAP[post.post_type as keyof typeof TYPE_MAP] } as PostPreview;
}

function _buildDraftItems(base: object, postType: PostType, items: QuizQuestion[] | FlashCard[]) {
  if (postType === 'FLA') {
    return { ...base, cards: (items as FlashCard[]).map(c => ({ question: c.question, answer: c.answer })) };
  }
  return {
    ...base,
    questions: (items as QuizQuestion[]).map(q => ({
      title: q.title,
      answers: q.answers.map(a => ({ text: a.text, is_correct: a.isCorrect })),
    })),
  };
}

// ── Posts / Documents ─────────────────────────────────────────────────────────

export const getLinkDescarga = (postId: number): string =>
  `/documents/download/pdf/${postId}`;

export const getMyPosts = async (userId: string | number): Promise<PostPreview[]> => {
  const response = await fetch(`/api/documents/?student=${userId}`);
  const data = await response.json();
  return data.map(_withExtendedType);
};

export const getPosts = async (courseId: number): Promise<PostPreview[]> => {
  try {
    const response = await fetch(`/api/documents/?course=${courseId}`);
    if (!response.ok) throw new Error("Error al obtener los posts");
    const data = await response.json();
    return data.map(_withExtendedType);
  } catch (error) {
    console.error("Error en getPosts:", error);
    throw error;
  }
};

export const getFilteredPosts = async (courseId: string | null, title: string, userId: string | null): Promise<PostPreview[]> => {
  try {
    const url = `/api/documents/?search_title=${title}${courseId ? `&course=${courseId}`  : ""} ${userId ? `&student=${userId}` : ""}`;
    const response = await fetch(url);
    if (!response.ok) throw new Error("Error al obtener los posts filtrados");
    const data = await response.json();
    return data.map(_withExtendedType);
  } catch (error) {
    console.error("Error en getFilteredPosts:", error);
    throw error;
  }
};

export const getDocument = async (postId: number): Promise<PostPreview> => {
  try {
    const response = await fetch(`/api/documents/${postId}`);
    if (!response.ok) throw new Error("Error al obtener el documento");
    return _withExtendedType(await response.json());
  } catch (error) {
    console.error("Error en getDocument:", error);
    throw error;
  }
};

export const postDocument = async (
  courseId: number,
  userId: number,
  title: string,
  description: string,
  docType: 'pdf' | 'vid',
  file: File
): Promise<PostPDF | PostVideo> => {
  try {
    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("course", courseId.toString());
    formData.append("student", userId.toString());
    formData.append("file", file);

    const response = await fetch(`/api/documents/upload/${docType}/`, { method: "POST", body: formData });
    if (!response.ok) throw new Error("Error al publicar el documento");
    return _withExtendedType(await response.json()) as PostPDF | PostVideo;
  } catch (error) {
    console.error("Error en postDocument:", error);
    throw error;
  }
};

export const postQuiz = async (
  courseId: number,
  userId: number,
  title: string,
  description: string,
  questions: QuizQuestion[]
): Promise<PostQuiz> => {
  try {
    const response = await fetch(`/api/documents/upload/quiz/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title,
        description,
        course: courseId,
        student: userId,
        questions: questions.map(q => ({
          title: q.title,
          answers: q.answers.map(a => ({ text: a.text, is_correct: a.isCorrect })),
        })),
      }),
    });
    if (!response.ok) throw new Error("Error al publicar el cuestionario");
    return _withExtendedType(await response.json()) as PostQuiz;
  } catch (error) {
    console.error("Error en postQuiz:", error);
    throw error;
  }
};

export const postFlashCardDeck = async (
  courseId: number,
  userId: number,
  title: string,
  description: string,
  cards: FlashCard[]
): Promise<PostFlashcard> => {
  try {
    const response = await fetch(`/api/documents/upload/flashcards/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title,
        description,
        course: courseId,
        student: userId,
        cards: cards.map(c => ({ question: c.question, answer: c.answer })),
      }),
    });
    if (!response.ok) throw new Error("Error al publicar las flashcards");
    return _withExtendedType(await response.json()) as PostFlashcard;
  } catch (error) {
    console.error("Error en postFlashCardDeck:", error);
    throw error;
  }
};

export const checkQuizAnswers = async (postId: number, responses: number[]): Promise<QuizCheckResponse> => {
  try {
    const response = await fetch(`/api/documents/${postId}/quiz/check/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ responses }),
    });
    if (!response.ok) throw new Error("Error al corregir el cuestionario");
    return await response.json() as QuizCheckResponse;
  } catch (error) {
    console.error("Error en checkQuizAnswers:", error);
    throw error;
  }
};

// ── Comments ──────────────────────────────────────────────────────────────────

export const getComments = async (documentId: number): Promise<Comment[]> => {
  try {
    const response = await fetch(`/api/documents/comments/?post=${documentId}`);
    if (!response.ok) throw new Error("Error al obtener los comentarios");
    return await response.json() as Comment[];
  } catch (error) {
    console.error("Error en getComments:", error);
    throw error;
  }
};

export const postComment = async (userId: number, postId: number, message: string): Promise<Comment> => {
  try {
    const response = await fetch(`/api/documents/comments/?user=${userId}&post=${postId}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user: userId, post: postId, message }),
    });
    if (!response.ok) throw new Error("Error al agregar el comentario");
    return await response.json() as Comment;
  } catch (error) {
    console.error("Error en postComment:", error);
    throw error;
  }
};


// ── Drafts ────────────────────────────────────────────────────────────────────

export const getDraft = async (draftId: number): Promise<Draft> => {
  try {
    const response = await fetch(`/api/documents/drafts/${draftId}/`);
    if (!response.ok) throw new Error("Error al obtener el borrador");
    return await response.json() as Draft;
  } catch (error) {
    console.error("Error en getDraft:", error);
    throw error;
  }
};

export const getDrafts = async (userId: number): Promise<Draft[]> => {
  try {
    const response = await fetch(`/api/documents/drafts/?student=${userId}`);
    if (!response.ok) throw new Error("Error al obtener los borradores");
    return await response.json() as Draft[];
  } catch (error) {
    console.error("Error en getDrafts:", error);
    throw error;
  }
};

export const saveDraft = async (
  studentId: number,
  courseId: number,
  postType: PostType,
  title: string,
  description: string,
  items: QuizQuestion[] | FlashCard[]
): Promise<Draft> => {
  try {
    const response = await fetch(`/api/documents/drafts/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(
        _buildDraftItems({ student: studentId, course: courseId, post_type: postType, title, description }, postType, items)
      ),
    });
    if (!response.ok) throw new Error("Error al guardar el borrador");
    return await response.json() as Draft;
  } catch (error) {
    console.error("Error en saveDraft:", error);
    throw error;
  }
};

export const updateDraft = async (
  draftId: number,
  title: string,
  description: string,
  postType: PostType,
  items: QuizQuestion[] | FlashCard[],
  isPublishing: boolean = false
): Promise<Draft> => {
  try {
    const payload = {
      ..._buildDraftItems({ title, description }, postType, items),
      publish: isPublishing
    };

    const response = await fetch(`/api/documents/drafts/${draftId}/`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    
    if (!response.ok) throw new Error("Error al actualizar el borrador");
    return await response.json() as Draft;
  } catch (error) {
    console.error("Error en updateDraft:", error);
    throw error;
  }
};

export const uploadPDFDraft = async (
  courseId: string | number,
  userId: string | number,
  title: string,
  description: string,
  file: File
): Promise<{ post_id: number; attachment_id: number; message: string }> => {
  try {
    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("course", courseId.toString());
    formData.append("student", userId.toString());
    formData.append("file", file);

    const response = await fetch(`/api/documents/upload-draft/`, {
      method: "POST",
      body: formData,
    });
    
    if (!response.ok) throw new Error("Error al iniciar la vectorización del documento");
    return await response.json();
  } catch (error) {
    console.error("Error en uploadPDFDraft:", error);
    throw error;
  }
};

export const deleteDraft = async (draftId: string) => {
  try {
    const response = await fetch(`/api/documents/drafts/${draftId}/`, { method: "DELETE" });
    if (!response.ok) throw new Error("Error al eliminar el borrador");
  } catch (error) {
    console.error("Error en deleteDraft:", error);
    throw error;
  }
};

const csrfToken = document.cookie.match(/csrftoken=([\w-]+)/)?.[1] ?? '';
export const deleteDocument = async (postId: number, studentId: number): Promise<void> => {
  try {
    const response = await fetch(`/api/documents/delete/${postId}/${studentId}`, 
                                { method: "DELETE", headers: { 'X-CSRFToken': csrfToken, 'Content-Type': 'application/json',},
    credentials: 'include', });
    if (!response.ok) throw new Error("Error al eliminar el documento");
  } catch (error) {
    console.error("Error en deleteDocument:", error);
    throw error;
  }
};

export const askChatbot = async (question: string, course_id = "", mode = "estricto", deep_thinking = false) => {
    try {
        const response = await fetch(`/api/ai/chat/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                student_question: question,
                course: course_id,
                mode: mode,
                deep_thinking: deep_thinking
            }),
        });

        if (!response.ok) {
            throw new Error("Error en la comunicación con el asistente");
        }

        return await response.json();
    } catch (error) {
        console.error("Chatbot Connection Error:", error);
        throw error;
    }
};


export const connectToDocumentStatus = (attachmentId, onMessage) => {
  if (!attachmentId) return null;

  const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
  const host = window.location.host;
  
  const socket = new WebSocket(`${protocol}//${host}/ws/documents/${attachmentId}/`);

  socket.onmessage = (event) => onMessage(JSON.parse(event.data));
  socket.onopen = () => console.log("✅ RAG WebSocket Activo");
  socket.onclose = () => console.log("🔌 RAG WebSocket Cerrado");

  return socket;
};