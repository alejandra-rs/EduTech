export interface StudyProgressBarProps {
  current: number;
  total: number;
  correct: number;
  incorrect: number;
  unanswered: number;
}

const StudyProgressBar = ({ current, total, correct, incorrect, unanswered }: StudyProgressBarProps) => (
  <div className="mb-8">
    <div className="flex items-center justify-end mb-2">
      <span className="text-md font-black text-gray-700">{current} / {total}</span>
    </div>
    <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
      <div
        className="h-full bg-purple-500 rounded-full transition-all duration-500"
        style={{ width: total > 0 ? `${(current / total) * 100}%` : "0%" }}
      />
    </div>
    <div className="flex gap-4 mt-2">
      <span className="text-sm text-green-600 font-bold">{correct} correctas</span>
      <span className="text-sm text-red-500 font-bold">{incorrect} incorrectas</span>
      <span className="text-sm text-gray-400">{unanswered} sin responder</span>
    </div>
  </div>
);

export default StudyProgressBar;
