import { PDF_STATES } from "./states.model";

export type PostType = 'PDF' | 'VID' | 'QUI' | 'FLA';

export interface PostExtendedType<T extends PostType> {
  key: T;
  label: string;
}

export type ExtendedTypeMap = {
  PDF: 'documento';
  VID: 'video';
  QUI: 'quiz';
  FLA: 'flashcard';
};

export const POST_TYPE_LABELS: Record<PostType, ExtendedTypeMap[PostType]> = {
  PDF: "documento",
  VID: "video",
  QUI: "quiz",
  FLA: "flashcard",
};

export interface PostBase <T extends PostType> {
  id: number;
  title: string;
  created_at: string; 
  course: number;
  year: number;
  views: number;
  likes: number;
  dislikes: number;
  post_type: T;
  extendedType: ExtendedTypeMap[T];
};



export interface PostPDF extends PostBase<'PDF'> {
  pdf: PDFAttachment;
}

export interface PDFAttachment {
  id: number;
  PROCESING_STATUS: PDF_STATES;
  file: string; 
}


export interface PostVideo extends PostBase<'VID'>{
  vid: YoutubeVideo;
}

export interface YoutubeVideo {
  id: number;
  vid: string; 
}


export interface PostQuiz extends PostBase<'QUI'> {
  qui: QuizPreview;

}

export interface QuizPreview {
  id: number;
  question_count: number;
}

export interface PostFlashcard extends PostBase<'FLA'> {
  fla: FlashCardDeckPreview;
}

export interface FlashCardDeckPreview {
  id: number;
  card_count: number;
}
  
  export type PostPreview = PostPDF | PostVideo | PostQuiz | PostFlashcard;