const QuizStats = ({ stats }) => {
  return (
    <div className="grid grid-cols-1 gap-2">
      <div className="flex items-center justify-between p-3 bg-white border border-gray-100 rounded-xl shadow-sm">
        <span className="text-[10px] font-bold text-gray-400 uppercase">Totales</span>
        <span className="text-sm font-black text-gray-800">{stats.total}</span>
      </div>
      <div className="flex items-center justify-between p-3 bg-green-50/50 border border-green-100 rounded-xl shadow-sm">
        <span className="text-[10px] font-bold text-green-600 uppercase">Correctas</span>
        <span className="text-sm font-black text-green-700">{stats.correct}</span>
      </div>
      <div className="flex items-center justify-between p-3 bg-red-50/50 border border-red-100 rounded-xl shadow-sm">
        <span className="text-[10px] font-bold text-red-600 uppercase">Fallidas</span>
        <span className="text-sm font-black text-red-700">{stats.incorrect}</span>
      </div>
    </div>
  );
};

export default QuizStats;