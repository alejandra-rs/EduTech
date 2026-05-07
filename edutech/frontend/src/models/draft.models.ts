import { PostType } from "./post.model";
import { Deck } from "./postsTypesModels/flashcard.model";
import { QuizQuestion } from "./postsTypesModels/quiz.models";

export interface DraftBase<T extends PostType> {
  id: number;
  title: string;
  description: string;
  post_type: T;
  student: number;
  course: number;
}
export interface DraftPDF extends DraftBase<'PDF'> {}
export interface DraftVideo extends DraftBase<'VID'> {}

export interface DraftQuiz extends DraftBase<'QUI'> {
  questions: QuizQuestion[]; 
}

export interface DraftFlashcard extends DraftBase<'FLA'> {
  cards: Deck; 
}

export type Draft = DraftPDF | DraftVideo | DraftQuiz | DraftFlashcard;