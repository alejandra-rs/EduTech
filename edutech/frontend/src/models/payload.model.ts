import { PostType } from "./post.model";
import { Deck, FlashCard } from "./postsTypesModels/flashcard.model";
import { QuizQuestion } from "./postsTypesModels/quiz.models";

export interface CreatePayloadBase<T extends PostType> {
  post_type: T;
  title: string;
  description: string;
  courseId: number;
  studentId: number;
  isDraft?: boolean;
}

export interface CreateDocumentPayload extends CreatePayloadBase<'PDF'> {
  file: File;
}
export interface CreateVideoPayload extends CreatePayloadBase<'VID'> {
  url: string; 
}

export interface CreateQuizPayload extends CreatePayloadBase<'QUI'> {  
  questions: QuizQuestion[];
}

export interface CreateFlashcardPayload extends CreatePayloadBase<'FLA'> {  
  flashcards: FlashCard[];
}

export type CreateMediaPayload = CreateDocumentPayload | CreateVideoPayload;