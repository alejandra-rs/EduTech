import { PDF_STATES } from '../models/documents/states.model';
import { QueryChatbotPayload } from '../models/documents/payload.model';
import { apiFetch } from './api';

export async function askChatbot(query: QueryChatbotPayload): Promise<any> {
  try {
    const response = await apiFetch(`/api/ai/chat/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        student_question: query.question,
        course: query.course_id,
        mode: query.mode,
        deep_thinking: query.deep_thinking
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
}

export const generateDocumentDescription = async (draftId: number): Promise<string> => {
    try {
        const response = await apiFetch(`/api/ai/documents/${draftId}/generate-description/`, {
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
