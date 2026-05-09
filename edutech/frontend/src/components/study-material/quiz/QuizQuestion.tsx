import { PlusIcon, TrashIcon } from "@heroicons/react/24/outline";
import QuizAnswer from './QuizAnswer';
import Input from '../../Input';
import type { QuizEditorQuestion, QuizEditorAnswer } from '../../../models/documents/postsTypesModels/quiz.models';

export interface QuizQuestionProps {
  question: QuizEditorQuestion;
  onUpdate: (question: QuizEditorQuestion) => void;
  onDelete: () => void;
  canDelete?: boolean;
}

const QuizQuestion = ({ question, onUpdate, onDelete, canDelete = true }: QuizQuestionProps) => {
  const addAnswer = () =>
    onUpdate({ ...question, answers: [...question.answers, { id: crypto.randomUUID(), text: '', is_correct: false }] });

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow animate-in fade-in slide-in-from-bottom-2">
      <div className="flex items-start justify-between gap-4 mb-4">
        <div className="flex-1">
          <Input
            noBorder
            value={question.title}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => onUpdate({ ...question, title: e.target.value })}
            placeholder="Pregunta sin título"
          />
        </div>
        <div className="flex items-center gap-2 mt-1 flex-shrink-0">
          <button
            onClick={addAnswer}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 text-gray-600 rounded-lg hover:bg-blue-600 hover:text-white transition-all active:scale-90 font-medium text-xs border border-gray-100"
          >
            <PlusIcon className="w-4 h-4 stroke-[2.5px]" />
            Respuesta
          </button>
          <button
            onClick={onDelete}
            disabled={!canDelete}
            className="p-1.5 rounded-lg text-gray-300 hover:text-red-500 hover:bg-red-50 transition-all disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:text-gray-300 disabled:hover:bg-transparent"
            title="Eliminar pregunta"
          >
            <TrashIcon className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="space-y-2">
        {question.answers.map((ans: QuizEditorAnswer) => (
          <QuizAnswer
            key={ans.id}
            value={ans.text}
            isCorrect={ans.is_correct}
            canDelete={question.answers.length > 2}
            onChange={(e) => onUpdate({ ...question, answers: question.answers.map(a => a.id === ans.id ? { ...a, text: (e.target as HTMLInputElement | HTMLTextAreaElement).value } : a) })}
            onDelete={() => onUpdate({ ...question, answers: question.answers.filter(a => a.id !== ans.id) })}
            onToggleCorrect={() => onUpdate({ ...question, answers: question.answers.map(a => a.id === ans.id ? { ...a, is_correct: !ans.is_correct } : a) })}
          />
        ))}
      </div>
    </div>
  );
};

export default QuizQuestion;
