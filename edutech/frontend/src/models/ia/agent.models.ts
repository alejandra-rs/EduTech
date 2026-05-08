export type ChatMode = 'estricto' | 'tutor' | 'ejercicios' | 'esquemas';

export interface ChatModeOption<T extends ChatMode> {
  key: T;
  label: string;
}

export type ChatModeMap<T extends ChatMode> = Record<T, ChatModeOption<T>>;
export type ChatModeSequence<T extends ChatMode> = ChatModeOption<T>[];

export const CHAT_MODES_MAP: ChatModeMap<ChatMode> = {
  estricto: { key: "estricto", label: "Asistente Estricto" },
  tutor: { key: "tutor", label: "Tutor" },
  ejercicios: { key: "ejercicios", label: "Ejercicios" },
  esquemas: { key: "esquemas", label: "Esquemas" },
};

export const CHAT_MODES: ChatModeSequence<ChatMode> = [
  CHAT_MODES_MAP.estricto,
  CHAT_MODES_MAP.tutor,
  CHAT_MODES_MAP.ejercicios,
  CHAT_MODES_MAP.esquemas,
];