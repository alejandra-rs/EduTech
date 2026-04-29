const CompletionBanner = ({ variant = "flashcard", stats, onRestart }) => {
  return (
    <div className="mt-16 p-10 bg-gray-900 rounded-[2.5rem] text-center text-white animate-in zoom-in duration-500">
    <h2 className="text-2xl font-bold mb-2">{(variant === "flashcard") ? "Flashcards Completadas" : "Cuestionario Completado"}</h2>
    <div className="text-5xl font-black text-blue-400 mb-1">{stats.correct} / {stats.total}</div>
    <div className="text-2xl font-bold text-blue-300 mb-8">{Math.round((stats.correct / stats.total) * 100)}%</div>
    <div className="flex justify-center gap-6 mb-8 text-sm">
      <span className="text-green-400 font-bold">{stats.correct} correctas</span>
      <span className="text-red-400 font-bold">{stats.incorrect} incorrectas</span>
    </div>
    <button
      onClick={onRestart}
      className="text-xs uppercase tracking-widest text-gray-400 hover:text-white transition-colors"
    >
      Volver a empezar
    </button>
  </div>
  );
};

export default CompletionBanner;
