import { TrashIcon, CheckIcon } from "@heroicons/react/24/outline";
import Input from '../../Input';

export interface QuizAnswerProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => void;
  onDelete: () => void;
  isCorrect: boolean;
  onToggleCorrect: () => void;
  canDelete?: boolean;
}

const QuizAnswer = ({ value, onChange, onDelete, isCorrect, onToggleCorrect, canDelete = true }: QuizAnswerProps) => (
  <div className={`flex items-center gap-3 px-3 py-2 rounded-lg border transition-all duration-200 group ${
    isCorrect ? 'border-green-400 bg-green-50/50 shadow-sm' : 'border-gray-100 bg-white hover:border-gray-300'
  }`}>
    <button
      onClick={onToggleCorrect}
      className={`w-5 h-5 rounded border flex items-center justify-center transition-all active:scale-75 flex-shrink-0 ${
        isCorrect ? 'bg-green-500 border-green-500 text-white' : 'border-gray-300 bg-gray-50 hover:border-green-400'
      }`}
    >
      {isCorrect && <CheckIcon className="w-3 h-3 stroke-[4px]" />}
    </button>

    <div className="flex-1">
      <Input
        autoResize
        textarea
        noBorder
        value={value}
        onChange={onChange}
        placeholder="Respuesta..."
        className={`w-full resize-none overflow-hidden outline-none bg-transparent leading-tight py-1 ${isCorrect ? 'text-green-900' : 'text-gray-700'}`}
      />
    </div>

    {canDelete && (
      <button onClick={onDelete} className="text-gray-300 p-1 rounded hover:text-red-500 hover:bg-red-50 transition-all flex-shrink-0">
        <TrashIcon className="w-4 h-4" />
      </button>
    )}
  </div>
);

export default QuizAnswer;
