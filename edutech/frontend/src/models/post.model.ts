import { PDF_STATES } from "./states.model";



export interface YoutubeVideo {
  id: number;
  vid: string; 
}

export interface QuizPreview {
  id: number;
  question_count: number;
}

export interface FlashCardDeckPreview {
  id: number;
  card_count: number;
}


export interface PostBase {
  id: number;
  title: string;
  created_at: string; 
  course: number;
  year: number;
  views: number;
  likes: number;
  dislikes: number;
}


export interface PostPDF extends PostBase {
  post_type: 'PDF';
  extendedType: 'documento'; 
  pdf: PDFAttachment;
}

export interface PostVideo extends PostBase {
  post_type: 'VID';
  extendedType: 'video';
  vid: YoutubeVideo;
}

export interface PostQuiz extends PostBase {
  post_type: 'QUI';
  extendedType: 'quiz';
  qui: QuizPreview;

}

export interface PostFlashcard extends PostBase {
  post_type: 'FLA';
  extendedType: 'flashcard';
  fla: FlashCardDeckPreview;
}

export interface PDFAttachment {
  id: number;
  PROCESING_STATUS: PDF_STATES;
  file: string; 
}
  
  export type PostPreview = PostPDF | PostVideo | PostQuiz | PostFlashcard;