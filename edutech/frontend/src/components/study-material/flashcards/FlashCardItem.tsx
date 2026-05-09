import { TrashIcon } from "@heroicons/react/24/outline";
import Input from '../../Input';
import type { FlashCardEditorItem } from '../../../models/documents/postsTypesModels/flashcard.model';

export interface FlashCardItemProps {
  card: FlashCardEditorItem;
  onUpdate: (card: FlashCardEditorItem) => void;
  onDelete: () => void;
  canDelete?: boolean;
}

const FlashCardItem = ({ card, onUpdate, onDelete, canDelete = true }: FlashCardItemProps) => (
  <div className="flex gap-3 items-center group animate-in fade-in slide-in-from-bottom-2">
    <div className="flex-1 flex flex-col sm:flex-row border border-gray-200 rounded-2xl shadow-sm hover:shadow-md transition-shadow overflow-hidden">
      <div className="flex-1 p-10 bg-white">
        <Input
          textarea
          noBorder
          autoResize
          label="Pregunta"
          value={card.question}
          onChange={(e) => onUpdate({ ...card, question: (e.target as HTMLTextAreaElement).value })}
          placeholder="Escribe la pregunta..."
          className="w-full resize-none overflow-hidden outline-none bg-transparent leading-tight py-1"
        />
      </div>
      <div className="h-px w-full sm:h-auto sm:w-px bg-gray-200 sm:self-stretch" />
      <div className="flex-1 p-10 bg-purple-50/60">
        <Input
          textarea
          noBorder
          autoResize
          label="Respuesta"
          value={card.answer}
          onChange={(e) => onUpdate({ ...card, answer: (e.target as HTMLTextAreaElement).value })}
          placeholder="Escribe la respuesta..."
          className="w-full resize-none overflow-hidden outline-none bg-transparent leading-tight py-1"
        />
      </div>
    </div>
    <button
      onClick={onDelete}
      disabled={!canDelete}
      className="p-1.5 rounded-lg text-gray-300 hover:text-red-500 hover:bg-red-50 active:scale-75 transition-all disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:text-gray-300 disabled:hover:bg-transparent"
      title="Eliminar flashcard"
    >
      <TrashIcon className="w-5 h-5" />
    </button>
  </div>
);

export default FlashCardItem;
