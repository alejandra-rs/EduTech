export interface QuizAnswer {
  id?: number;
  text: string;
  is_correct: boolean;
}

export interface QuizQuestion {
  id?: number;
  title: string;
  answers: QuizAnswer[];
}

export interface QuizCheckResponse {
  score: number;
  results: Array<{ answer_id: number; is_correct: boolean }>;
}

export interface Quiz {
  title: string;
  description: string;
  questions: QuizQuestion[];
}

export interface QuizEditorAnswer {
  id: string | number;
  text: string;
  is_correct: boolean;
}

export interface QuizEditorQuestion {
  id: string | number;
  title: string;
  answers: QuizEditorAnswer[];
}