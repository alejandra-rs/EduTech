export type FlashCard = {
  question: string;
  answer: string;
}; 

export type Deck = FlashCard[]; 

export interface FlashCardEditorItem extends FlashCard {
  id: string;
}