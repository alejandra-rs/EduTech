import { PDF_STATES } from '../models/states.model';
import { PostPreview, PostType, POST_TYPE_LABELS, PostPDF, PostVideo, PostQuiz, PostFlashcard } from "../models/post.model";
import { Draft, DraftBase } from '../models/draft.models';
import { QuizCheckResponse, QuizQuestion } from '../models/postsTypesModels/quiz.models';
import { Deck, FlashCard } from '../models/postsTypesModels/flashcard.model';
import { CreateDocumentPayload, CreateFlashcardPayload, CreateQuizPayload, CreateVideoPayload } from '../models/payload.model';

export function _withExtendedType(post: Omit<PostPreview, 'extendedType'>): PostPreview {
  return { ...post, extendedType: POST_TYPE_LABELS[post.post_type as PostType] } as PostPreview;
}

function _buildDraftItems(base: Draft, postType: PostType, items: QuizQuestion[] | Deck) {
  if (postType === 'FLA') {
    return { ...base, cards: (items as FlashCard[]).map(card => ({ question: card.question, answer: card.answer })) };
  }
  return {
    ...base,
    questions: (items as QuizQuestion[]).map(question => ({
      title: question.title,
      answers: question.answers.map(answer => ({ text: answer.text, is_correct: answer.is_correct })),
    })),
  };
}

// ── Posts / Documents ─────────────────────────────────────────────────────────

export const getLinkDescarga = (postId: number): string => `/documents/download/pdf/${postId}`;

export async function getMyPosts(userId: string): Promise<PostPreview[]> {
  try {
    const response = await fetch(`/api/documents/?student=${userId}`);
    if (!response.ok) throw new Error("Error al obtener los posts");
    const data = await response.json();
    return data.map(_withExtendedType);
  } catch (error) {
    console.error("Error en getMyPosts:", error);
    throw error;
  }
}


export async function getPosts(courseId: number): Promise<PostPreview[]> {
  try {
    const response = await fetch(`/api/documents/?course=${courseId}`);
    if (!response.ok) throw new Error("Error al obtener los posts");
    const data = await response.json();
    return data.map(_withExtendedType);
  } catch (error) {
    console.error("Error en getPosts:", error);
    throw error;
  }
}

export async function getFilteredPosts(courseId: string | null, title: string, userId: string | null): Promise<PostPreview[]> {
  try {
    const url = `/api/documents/?search_title=${title}${courseId ? `&course=${courseId}` : ""} ${userId ? `&student=${userId}` : ""}`;
    const response = await fetch(url);
    if (!response.ok) throw new Error("Error al obtener los posts filtrados");
    const data = await response.json();
    return data.map(_withExtendedType);
  } catch (error) {
    console.error("Error en getFilteredPosts:", error);
    throw error;
  }
}

export async function getDocument(postId: number): Promise<PostPreview> {
  try {
    const response = await fetch(`/api/documents/${postId}`);
    if (!response.ok) throw new Error("Error al obtener el documento");
    return _withExtendedType(await response.json());
  } catch (error) {
    console.error("Error en getDocument:", error);
    throw error;
  }
}

export async function postDocument(document: CreateDocumentPayload): Promise<PostPDF | PostVideo> {
  try {
    const formData = new FormData();
    formData.append("title", document.title);
    formData.append("description", document.description);
    formData.append("course", document.courseId.toString());
    formData.append("student", document.studentId.toString());
    formData.append("file", document.file);
    if (document.isDraft) formData.append("is_draft", "true");

    const response = await fetch(`/api/documents/upload/pdf/`, { method: "POST", body: formData });
    if (!response.ok) throw new Error("Error al publicar el documento");
    return _withExtendedType(await response.json()) as PostPDF;
  } catch (error) {
    console.error("Error en postDocument:", error);
    throw error;
  }
}

export async function postVideo(video: CreateVideoPayload): Promise<PostVideo> {
  try {
    const formData = new FormData();
    formData.append("title", video.title);
    formData.append("description", video.description);
    formData.append("course", video.courseId.toString());
    formData.append("student", video.studentId.toString());
    formData.append("url", video.url);
    if (video.isDraft) formData.append("is_draft", "true");

    const response = await fetch(`/api/documents/upload/vid/`, { method: "POST", body: formData });
    if (!response.ok) throw new Error("Error al publicar el documento");
    return _withExtendedType(await response.json()) as PostVideo;
  } catch (error) {
    console.error("Error en postDocument:", error);
    throw error;
  }
}

export async function postQuiz(quiz: CreateQuizPayload): Promise<PostQuiz> {
  try {
    const response = await fetch(`/api/documents/upload/quiz/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: quiz.title,
        description: quiz.description,
        course: quiz.courseId,
        student: quiz.studentId,
        questions: quiz.questions.map(question => ({
          title: question.title,
          answers: question.answers.map(answer => ({ text: answer.text, is_correct: answer.is_correct })),
        })),
      }),
    });
    if (!response.ok) throw new Error("Error al publicar el cuestionario");
    return _withExtendedType(await response.json()) as PostQuiz;
  } catch (error) {
    console.error("Error en postQuiz:", error);
    throw error;
  }
}

export async function postFlashCardDeck(flashcardDeck: CreateFlashcardPayload): Promise<PostFlashcard> {
  try {
    const response = await fetch(`/api/documents/upload/flashcards/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: flashcardDeck.title,
        description: flashcardDeck.description,
        course: flashcardDeck.courseId,
        student: flashcardDeck.studentId,
        cards: flashcardDeck.flashcards.map(card => ({ question: card.question, answer: card.answer })),
      }),
    });
    if (!response.ok) throw new Error("Error al publicar las flashcards");
    return _withExtendedType(await response.json()) as PostFlashcard;
  } catch (error) {
    console.error("Error en postFlashCardDeck:", error);
    throw error;
  }
}

export async function checkQuizAnswers(postId: number, responses: number[]): Promise<QuizCheckResponse> {
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
}

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

export const generateDocumentDescription = async (draftId: number): Promise<string> => {
    try {
        const response = await fetch(`/api/ai/documents/${draftId}/generate-description/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error("Error en la comunicación al generar la descripción");
        }

        const data = await response.json();
        return data.description;
        
    } catch (error) {
        console.error("Generate Description Error:", error);
        throw error;
    }
};

export const connectToDocumentStatus = (attachmentId: number, onMessage: (status: PDF_STATES) => void) => {
  if (!attachmentId) return null;

  const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
  const host = window.location.host;
  
  const socket = new WebSocket(`${protocol}//${host}/ws/documents/${attachmentId}/`);
  socket.onmessage = (event) => onMessage(JSON.parse(event.data).status as PDF_STATES);
  
  return socket;
};

