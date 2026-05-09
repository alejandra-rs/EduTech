import { Course } from "../courses/course.model";
import { PostType } from "./post.model";
import { Deck } from "./postsTypesModels/flashcard.model";
import { QuizQuestion } from "./postsTypesModels/quiz.models";

export interface DraftBase<T extends PostType> {
  id: number;
  title: string;
  description: string;
  post_type: T;
  student: number;
  course: Course;
  created_at?: string;
  updated_at?: string;
}
export interface DraftPDF extends DraftBase<'PDF'> {
  attach: File;
}
export interface DraftVideo extends DraftBase<'VID'> {
  url: string
}

export interface DraftFlashcard extends DraftBase<'FLA'> {
  fla: { 
    cards: Deck; 
  }; 
}

export interface DraftQuiz extends DraftBase<'QUI'> {
  qui: { 
    questions: QuizQuestion[]; 
  }; 
}

export type Draft = DraftPDF | DraftVideo | DraftQuiz | DraftFlashcard;