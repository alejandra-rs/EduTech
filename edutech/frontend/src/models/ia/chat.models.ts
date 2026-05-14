export interface ChatSource {
  id: number | string;
  titulo: string;
  p: number | string;
}

export type ChatRole = 'user' | 'ai';

export interface ChatMessage {
  role: ChatRole;
  content: string;
  fuentes?: ChatSource[];
}

export interface ChatbotResponse {
  respuesta: string;
  respuesta_markdown?: string;
  fuentes?: ChatSource[];
}

export interface MaterialResponse {
  message: string;
  draft_id: number;
  type: string;
}