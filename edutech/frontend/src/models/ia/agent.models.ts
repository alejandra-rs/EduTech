export type ChatMode = 'estricto' | 'tutor' | 'ejercicios' | 'esquemas';
export type Material = 'quiz' | 'flashcard';
export type Prompots = ChatMode | Material;

export interface ChatModeOption<T extends Prompots> {
  key: T;
  label: string;
}

export type ChatModeMap<T extends ChatMode> = Record<T, ChatModeOption<T>>;
export type MaterialMap<T extends Material> = Record<T, ChatModeOption<T>>;
export type ChatModeSequence<T extends ChatMode> = ChatModeOption<T>[];
export type MaterialSequence<T extends Material> = ChatModeOption<T>[];

export const CHAT_MODES_MAP: ChatModeMap<ChatMode> = {
  estricto: { key: "estricto", label: "Asistente Estricto" },
  tutor: { key: "tutor", label: "Tutor" },
  ejercicios: { key: "ejercicios", label: "Ejercicios" },
  esquemas: { key: "esquemas", label: "Esquemas" },
};

export const MATERIAL_MAP: MaterialMap<Material> = {
  quiz: { key: "quiz", label: "Quiz" },
  flashcard: { key: "flashcard", label: "Flashcard" },
};

export const MATERIAL_MODES: MaterialSequence<Material> = [
  MATERIAL_MAP.quiz,
  MATERIAL_MAP.flashcard
]


export const CHAT_MODES: ChatModeSequence<ChatMode> = [
  CHAT_MODES_MAP.estricto,
  CHAT_MODES_MAP.tutor,
  CHAT_MODES_MAP.ejercicios,
  CHAT_MODES_MAP.esquemas,
];