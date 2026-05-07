export interface QuizAnswer {
  text: string;
  is_correct: boolean;
}

export interface QuizQuestion {
  title: string;
  answers: QuizAnswer[];
}


export interface QuizCheckResponse {
  score: number;
  results: Array<{ answer_id: number; is_correct: boolean }>;
}

export interface Quiz {
    title: string
    description: string
    questions: QuizQuestion[]
}