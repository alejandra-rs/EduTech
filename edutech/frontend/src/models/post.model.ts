


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

export type PDF_STATES = 
  | "pending" 
  | "uploading" 
  | "extracting_information" 
  | "vectorizing" 
  | "labeling" 
  | "completed" 
  | "error";
export type procesingStatus = PDF_STATES; 

export interface Stage<T extends procesingStatus> {
  key: T;
  label: string;
}

export type Stages<T extends procesingStatus> = Stage<T>[]
export const PDF_STAGES: Stages<PDF_STATES> = [
  { key: "pending", label: "En cola para procesar..." },
  { key: "uploading", label: "Subiendo fichero..." },
  { key: "extracting_information", label: "Extrayendo información del PDF..." },
  { key: "vectorizing", label: "Vectorizando..." },
  { key: "labeling", label: "Etiquetando..." },
  { key: "completed", label: "¡Listo para IA!" },
  { key: "error", label: "Error en el procesamiento" }
];
  
  export type PostPreview = PostPDF | PostVideo | PostQuiz | PostFlashcard;