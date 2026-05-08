import { ChatMode } from "./agent.models";
import { Deck, FlashCard } from "./postsTypesModels/flashcard.model";
import { QuizQuestion } from "./postsTypesModels/quiz.models";

export interface CreatePayloadBase<T extends PostType> {
  post_type: T;
  title: string;
  description: string;
  courseId: number;
  studentId: number;
  isDraft?: boolean;
  publish?: boolean;
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

export interface QueryChatbotPayload{
  question: string
  course_id: string,
  mode: ChatMode,
  deep_thinking: boolean,
}

export type extended_item =  QuizQuestion[] | FlashCard[] |string | File;

export type PostType = 'QUI' | 'FLA' | 'VID' | 'PDF';

export type CreateMediaPayload = CreateDocumentPayload | CreateVideoPayload | CreateQuizPayload | CreateFlashcardPayload;
export type UploadDdaft = CreateMediaPayload & { draftId: number };
