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
  `/api/documents/download/pdf/${postId}`;

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

// ── Likes ─────────────────────────────────────────────────────────────────────

export const getLikes = async (userId: number, postId: number): Promise<LikeStatus> => {
  try {
    const response = await fetch(`/api/documents/likes/?user=${userId}&post=${postId}`);
    if (!response.ok) throw new Error("Error al obtener el estado del like");
    return await response.json() as LikeStatus;
  } catch (error) {
    console.error("Error en getLikes:", error);
    throw error;
  }
};

export const addLike = async (userId: number, postId: number): Promise<LikeStatus> => {
  try {
    const dislikes = await getDislikes(userId, postId);
    if (dislikes.id !== -1) await removeDislike(dislikes.id);
    const response = await fetch(`/api/documents/likes/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user: userId, post: postId }),
    });
    if (!response.ok) throw new Error("Error al dar like");
    return await response.json() as LikeStatus;
  } catch (error) {
    console.error("Error en addLike:", error);
    throw error;
  }
};

export const removeLike = async (likeId: number): Promise<void> => {
  try {
    const response = await fetch(`/api/documents/likes/${likeId}`, { method: "DELETE" });
    if (!response.ok) throw new Error("Error al quitar el like");
  } catch (error) {
    console.error("Error en removeLike:", error);
    throw error;
  }
};

// ── Dislikes ──────────────────────────────────────────────────────────────────

export const getDislikes = async (userId: number, postId: number): Promise<LikeStatus> => {
  try {
    const response = await fetch(`/api/documents/dislikes/?user=${userId}&post=${postId}`);
    if (!response.ok) throw new Error("Error al obtener el estado del dislike");
    return await response.json() as LikeStatus;
  } catch (error) {
    console.error("Error en getDislikes:", error);
    throw error;
  }
};

export const addDislike = async (userId: number, postId: number): Promise<LikeStatus> => {
  try {
    const likes = await getLikes(userId, postId);
    if (likes.id !== -1) await removeLike(likes.id);
    const response = await fetch(`/api/documents/dislikes/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user: userId, post: postId }),
    });
    if (!response.ok) throw new Error("Error al dar dislike");
    return await response.json() as LikeStatus;
  } catch (error) {
    console.error("Error en addDislike:", error);
    throw error;
  }
};

export const removeDislike = async (dislikeId: number): Promise<void> => {
  try {
    const response = await fetch(`/api/documents/dislikes/${dislikeId}`, { method: "DELETE" });
    if (!response.ok) throw new Error("Error al quitar el dislike");
  } catch (error) {
    console.error("Error en removeDislike:", error);
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

    // Asegúrate de que esta URL coincide con la que pongas en tu urls.py de Django
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