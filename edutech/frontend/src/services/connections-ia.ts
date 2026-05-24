import { PDF_STATES } from '../models/documents/states.model';
import { GenerateMaterialPayload, QueryChatbotPayload } from '../models/documents/payload.model';
import type { ChatbotResponse, MaterialResponse } from '../models/ia/chat.models';
import { apiFetchJson, JSON_HEADERS } from './api';
import { Ia_status_response } from '../models/ia/revision.model';

export const askChatbot = (query: QueryChatbotPayload): Promise<ChatbotResponse> =>
  apiFetchJson(`/api/ai/chat/`, {
    method: 'POST',
    headers: JSON_HEADERS,
    body: JSON.stringify({
      student_question: query.question,
      course: query.course_id,
      mode: query.mode,
      deep_thinking: query.deep_thinking,
      mentions: query.mentions ?? [],
    }),
  });

export const generateDocumentDescription = async (draftId: number): Promise<string> => {
  const data = await apiFetchJson<{ description: string }>(`/api/ai/documents/${draftId}/generate-description/`, {
    method: 'POST',
    headers: JSON_HEADERS,
  });
  return data.description;
};

export const validatePDF = (draftId: number): Promise<Ia_status_response> =>
  apiFetchJson(`/api/ai/documents/${draftId}/validate-documet/`, {
    method: 'POST',
    headers: JSON_HEADERS,
  });

export const connectToDocumentStatus = (attachmentId: number, onMessage: (status: PDF_STATES) => void): WebSocket | null => {
  if (!attachmentId) return null;
  const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
  const socket = new WebSocket(`${protocol}//${window.location.host}/ws/documents/${attachmentId}/`);
  socket.onmessage = (event) => onMessage(JSON.parse(event.data).status as PDF_STATES);
  return socket;
};

export const generateMaterial = (query: GenerateMaterialPayload): Promise<MaterialResponse> =>
  apiFetchJson(`/api/ai/generate-material/`, {
    method: 'POST',
    headers: JSON_HEADERS,
    body: JSON.stringify({
      student_question: query.question,
      course: query.course_id,
      material: query.material,
    }),
  });
