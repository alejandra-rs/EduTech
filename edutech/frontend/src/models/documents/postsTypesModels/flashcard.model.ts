export type FlashCard = {
  question: string;
  answer: string;
}; 

export type Deck = FlashCard[]; 

export interface FlashCardEditorItem extends FlashCard {
  id: string;
}

export interface StudyFlashCard {
  id: string | number;
  question: string;
  answer: string;
}