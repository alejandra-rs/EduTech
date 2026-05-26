import { PostPreview, PostType, POST_TYPE_LABELS, PostPDF, PostVideo, PostQuiz, PostFlashcard } from "../models/documents/post.model";
import { apiFetchJson, apiFetchVoid, JSON_HEADERS } from "./api";
import { Draft } from '../models/documents/draft.models';
import { QuizCheckResponse } from '../models/documents/postsTypesModels/quiz.models';
import { CreateDocumentPayload, CreateFlashcardPayload, CreateMediaPayload, CreateQuizPayload, CreateVideoPayload, UploadDraft } from '../models/documents/payload.model';

export const getDownloadUrl = (postId: number): Promise<{ url: string }> =>
  apiFetchJson(`/api/documents/download/pdf/${postId}`);

export function _withExtendedType(post: Omit<PostPreview, 'extendedType'>): PostPreview {
  return { ...post, extendedType: POST_TYPE_LABELS[post.post_type as PostType] } as PostPreview;
}

async function withLog<T>(label: string, fn: () => Promise<T>): Promise<T> {
  try {
    return await fn();
  } catch (error) {
    console.error(label, error);
    throw error;
  }
}

function buildDocumentFormData(doc: CreateDocumentPayload): FormData {
  const form = new FormData();
  form.append("title", doc.title);
  form.append("description", doc.description);
  form.append("course", doc.courseId.toString());
  form.append("file", doc.file);
  if (doc.isDraft) form.append("is_draft", "true");
  return form;
}

function buildVideoFormData(video: CreateVideoPayload): FormData {
  const form = new FormData();
  form.append("title", video.title);
  form.append("description", video.description);
  form.append("course", video.courseId.toString());
  form.append("url", video.url);
  if (video.isDraft) form.append("is_draft", "true");
  return form;
}

const PAYLOAD_FORMATTERS: Record<string, (payload: CreateMediaPayload) => any> = {
  QUI: (payload) => {
    const quiz = payload as CreateQuizPayload;
    return {
      questions: quiz.questions.map(q => ({
        title: q.title,
        answers: q.answers.map(a => ({ text: a.text, is_correct: a.is_correct })),
      })),
    };
  },
  FLA: (payload) => {
    const fla = payload as CreateFlashcardPayload;
    return {
      cards: fla.flashcards.map(c => ({ question: c.question, answer: c.answer })),
    };
  },
};

function buildDraftBody(payload: CreateMediaPayload): object {
  const formatter = PAYLOAD_FORMATTERS[payload.post_type];
  return {
    post_type: payload.post_type,
    title: payload.title,
    description: payload.description,
    course: payload.courseId,
    ...(formatter ? formatter(payload) : {}),
  };
}

function buildUpdateDraftBody(draft: UploadDraft): object {
  const formatter = PAYLOAD_FORMATTERS[draft.post_type];
  return {
    draftId: draft.draftId,
    post_type: draft.post_type,
    title: draft.title,
    description: draft.description,
    course: draft.courseId,
    ...(draft.isDraft !== undefined && { is_draft: draft.isDraft }),
    ...(formatter ? formatter(draft) : {}),
  };
}

export const getMyPosts = (): Promise<PostPreview[]> =>
  withLog("Error en getMyPosts:", async () => {
    const data = await apiFetchJson<PostPreview[]>(`/api/documents/my/`);
    return data.map(_withExtendedType);
  });

export const getPosts = (courseId: number): Promise<PostPreview[]> =>
  withLog("Error en getPosts:", async () => {
    const data = await apiFetchJson<PostPreview[]>(`/api/documents/?course=${courseId}`);
    return data.map(_withExtendedType);
  });

export const getFilteredPosts = (courseId: string | null, title: string): Promise<PostPreview[]> =>
  withLog("Error en getFilteredPosts:", async () => {
    const url = `/api/documents/?search_title=${title}${courseId ? `&course=${courseId}` : ""}`;
    const data = await apiFetchJson<PostPreview[]>(url);
    return data.map(_withExtendedType);
  });

export const getMyFilteredPosts = (courseId: string | null, title: string): Promise<PostPreview[]> =>
  withLog("Error en getMyFilteredPosts:", async () => {
    const url = `/api/documents/my/?search_title=${title}${courseId ? `&course=${courseId}` : ""}`;
    const data = await apiFetchJson<PostPreview[]>(url);
    return data.map(_withExtendedType);
  });

export const getDocument = (postId: number): Promise<PostPreview> =>
  withLog("Error en getDocument:", async () =>
    _withExtendedType(await apiFetchJson(`/api/documents/${postId}`))
  );

export const postDocument = (document: CreateDocumentPayload): Promise<PostPDF | PostVideo> =>
  withLog("Error en postDocument:", async () => {
    const raw = await apiFetchJson<PostPDF>(`/api/documents/upload/pdf/`, { method: "POST", body: buildDocumentFormData(document) });
    return _withExtendedType(raw) as PostPDF;
  });

export const postVideo = (video: CreateVideoPayload): Promise<PostVideo> =>
  withLog("Error en postDocument:", async () => {
    const raw = await apiFetchJson<PostVideo>(`/api/documents/upload/vid/`, { method: "POST", body: buildVideoFormData(video) });
    return _withExtendedType(raw) as PostVideo;
  });

export const postQuiz = (quiz: CreateQuizPayload): Promise<PostQuiz> =>
  withLog("Error en postQuiz:", async () => {
    const body = JSON.stringify({
      title: quiz.title,
      description: quiz.description,
      course: quiz.courseId,
      questions: quiz.questions.map(q => ({
        title: q.title,
        answers: q.answers.map(a => ({ text: a.text, is_correct: a.is_correct })),
      })),
    });
    const raw = await apiFetchJson<PostQuiz>(`/api/documents/upload/quiz/`, { method: "POST", headers: JSON_HEADERS, body });
    return _withExtendedType(raw) as PostQuiz;
  });

export const postFlashCardDeck = (flashcardDeck: CreateFlashcardPayload): Promise<PostFlashcard> =>
  withLog("Error en postFlashCardDeck:", async () => {
    const body = JSON.stringify({
      title: flashcardDeck.title,
      description: flashcardDeck.description,
      course: flashcardDeck.courseId,
      cards: flashcardDeck.flashcards.map(c => ({ question: c.question, answer: c.answer })),
    });
    const raw = await apiFetchJson<PostFlashcard>(`/api/documents/upload/flashcards/`, { method: "POST", headers: JSON_HEADERS, body });
    return _withExtendedType(raw) as PostFlashcard;
  });

export const checkQuizAnswers = (postId: number, responses: number[]): Promise<QuizCheckResponse> =>
  withLog("Error en checkQuizAnswers:", () =>
    apiFetchJson(`/api/documents/${postId}/quiz/check/`, { method: "POST", headers: JSON_HEADERS, body: JSON.stringify({ responses }) })
  );

export const getDraft = (draftId: number): Promise<Draft> =>
  withLog("Error en getDraft:", () =>
    apiFetchJson(`/api/documents/drafts/${draftId}/`)
  );

export const getDrafts = (): Promise<Draft[]> =>
  withLog("Error en getDrafts:", () =>
    apiFetchJson(`/api/documents/drafts/`)
  );

export const saveDraft = (payload: CreateMediaPayload): Promise<Draft> =>
  withLog("Error en saveDraft:", () =>
    apiFetchJson(`/api/documents/drafts/`, { method: "POST", headers: JSON_HEADERS, body: JSON.stringify(buildDraftBody(payload)) })
  );

export const updateDraft = (draft: UploadDraft): Promise<Draft> =>
  withLog("Error en updateDraft:", () =>
    apiFetchJson(`/api/documents/drafts/${draft.draftId}/`, { method: "PATCH", headers: JSON_HEADERS, body: JSON.stringify(buildUpdateDraftBody(draft)) })
  );

export const uploadPDFDraft = (document: CreateDocumentPayload): Promise<{ post_id: number; attachment_id: number; message: string }> =>
  withLog("Error en uploadPDFDraft:", () =>
    apiFetchJson(`/api/documents/upload-draft/`, { method: "POST", body: buildDocumentFormData(document) })
  );

export const deleteDraft = (draftId: number): Promise<void> =>
  withLog("Error en deleteDraft:", () =>
    apiFetchVoid(`/api/documents/drafts/${draftId}/`, { method: "DELETE" })
  );

export const deleteDocument = (postId: number): Promise<void> =>
  withLog("Error en deleteDocument:", () =>
    apiFetchVoid(`/api/documents/delete/${postId}/`, { method: "DELETE", headers: JSON_HEADERS })
  );

export const publishPDFDraft = (draftId: number, title: string, description: string): Promise<void> =>
  withLog("Error en publishPDFDraft:", () =>
    apiFetchVoid(`/api/documents/drafts/${draftId}/`, { method: "PATCH", headers: JSON_HEADERS, body: JSON.stringify({ title, description, is_draft: false }) })
  );
