import { PostPreview, PostType, POST_TYPE_LABELS, PostPDF, PostVideo, PostQuiz, PostFlashcard } from "../models/documents/post.model";
import { apiFetch } from "./api";
import { Draft } from '../models/documents/draft.models';
import { QuizCheckResponse } from '../models/documents/postsTypesModels/quiz.models';
import { CreateDocumentPayload, CreateFlashcardPayload, CreateMediaPayload, CreateQuizPayload, CreateVideoPayload, UploadDraft } from '../models/documents/payload.model';

export function _withExtendedType(post: Omit<PostPreview, 'extendedType'>): PostPreview {
  return { ...post, extendedType: POST_TYPE_LABELS[post.post_type as PostType] } as PostPreview;
}

// ── Posts / Documents ─────────────────────────────────────────────────────────

export const getLinkDescarga = (postId: number): string => `/api/documents/download/pdf/${postId}`;

export async function getMyPosts(userId: string): Promise<PostPreview[]> {
  try {
    const response = await apiFetch(`/api/documents/?student=${userId}`);
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
    const response = await apiFetch(`/api/documents/?course=${courseId}`);
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
    const response = await apiFetch(url);
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
    const response = await apiFetch(`/api/documents/${postId}`);
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

    const response = await apiFetch(`/api/documents/upload/pdf/`, { method: "POST", body: formData });
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

    const response = await apiFetch(`/api/documents/upload/vid/`, { method: "POST", body: formData });
    if (!response.ok) throw new Error("Error al publicar el documento");
    return _withExtendedType(await response.json()) as PostVideo;
  } catch (error) {
    console.error("Error en postDocument:", error);
    throw error;
  }
}

export async function postQuiz(quiz: CreateQuizPayload): Promise<PostQuiz> {
  try {
    const response = await apiFetch(`/api/documents/upload/quiz/`, {
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
    const response = await apiFetch(`/api/documents/upload/flashcards/`, {
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
    const response = await apiFetch(`/api/documents/${postId}/quiz/check/`, {
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

export async function getDraft(draftId: number): Promise<Draft> {
  try {
    const response = await apiFetch(`/api/documents/drafts/${draftId}/`);
    if (!response.ok) throw new Error("Error al obtener el borrador");
    return await response.json() as Draft;
  } catch (error) {
    console.error("Error en getDraft:", error);
    throw error;
  }
}

export async function getDrafts(userId: number): Promise<Draft[]> {
  try {
    const response = await apiFetch(`/api/documents/drafts/?student=${userId}`);
    if (!response.ok) throw new Error("Error al obtener los borradores");
    return await response.json() as Draft[];
  } catch (error) {
    console.error("Error en getDrafts:", error);
    throw error;
  }
}


const PAYLOAD_FORMATTERS: Record<string, (payload: CreateMediaPayload) => any> = {
  QUI: (payload) => {
    const quiz = payload as CreateQuizPayload; 
    return {
      questions: quiz.questions.map(question => ({
        title: question.title,
        answers: question.answers.map(answer => ({ 
          text: answer.text, 
          is_correct: answer.is_correct 
        })),
      }))
    };
  },

  FLA: (payload) => {
    const fla = payload as CreateFlashcardPayload;
    return {
      cards: fla.flashcards.map(card => ({
        question: card.question,
        answer: card.answer
      }))
    };
  }
};

export async function saveDraft(payload: CreateMediaPayload): Promise<Draft> {
  try {
    const formatterFunction = PAYLOAD_FORMATTERS[payload.post_type];
    const specificData = formatterFunction ? formatterFunction(payload) : {};

    const bodyContent = {
      post_type: payload.post_type,
      title: payload.title,
      description: payload.description,
      course: payload.courseId,
      student: payload.studentId,
      ...specificData
    };

    const response = await apiFetch(`/api/documents/drafts/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(bodyContent),
    });

    if (!response.ok) throw new Error("Error al guardar el borrador");
    
    return await response.json() as Draft;
  } catch (error) {
    console.error("Error en saveDraft:", error);
    throw error;
  }
}
export async function updateDraft(draft: UploadDraft): Promise<Draft> {
  try {
    const formatterFunction = PAYLOAD_FORMATTERS[draft.post_type];
    const specificData = formatterFunction ? formatterFunction(draft) : {};
    
    const bodyContent = {
      draftId: draft.draftId,
      post_type: draft.post_type,
      title: draft.title,
      description: draft.description,
      course: draft.courseId,
      student: draft.studentId,
      ...specificData
    };

    const response = await apiFetch(`/api/documents/drafts/${draft.draftId}/`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(bodyContent),
    });

    if (!response.ok) throw new Error("Error al actualizar el borrador");

    return await response.json() as Draft;
  } catch (error) {
    console.error("Error en updateDraft:", error);
    throw error;
  }
}

export async function uploadPDFDraft(document: CreateDocumentPayload): Promise<{ post_id: number; attachment_id: number; message: string; }> {
  try {
    const formData = new FormData();
    formData.append("title", document.title);
    formData.append("description", document.description);
    formData.append("course", document.courseId.toString());
    formData.append("student", document.studentId.toString());
    formData.append("file", document.file);

    const response = await apiFetch(`/api/documents/upload-draft/`, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) throw new Error("Error al iniciar la vectorización del documento");
    return await response.json();
  } catch (error) {
    console.error("Error en uploadPDFDraft:", error);
    throw error;
  }
}

export async function deleteDraft(draftId: number) {
  try {
    const response = await apiFetch(`/api/documents/drafts/${draftId}/`, { method: "DELETE" });
    if (!response.ok) throw new Error("Error al eliminar el borrador");
  } catch (error) {
    console.error("Error en deleteDraft:", error);
    throw error;
  }
}

export async function deleteDocument(postId: number, studentId: number): Promise<void> {
  try {
    const response = await apiFetch(`/api/documents/delete/${postId}/${studentId}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
    });
    if (!response.ok) throw new Error("Error al eliminar el documento");
  } catch (error) {
    console.error("Error en deleteDocument:", error);
    throw error;
  }
}

