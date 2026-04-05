import Input from './Input';

export default function ModalComentario({ isOpen, onClose, onSubmit }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="p-8">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-2xl font-bold text-gray-800">Nuevo Comentario</h3>
            <button onClick={onClose} className="text-gray-400 hover:text-black text-2xl">&times;</button>
          </div>
          <form onSubmit={(e) => { e.preventDefault(); onSubmit(); }}>
            <Input 
              label="Tu mensaje" 
              placeholder="Escribe lo que piensas..." 
              rows={5} 
            />
            <div className="mt-8 flex gap-3">
              <button 
                type="button"
                onClick={onClose}
                className="flex-1 py-3 rounded-xl border border-gray-200 text-gray-600 font-semibold hover:bg-gray-50 transition-colors"
              >
                Cancelar
              </button>
              <button 
                type="submit"
                className="flex-1 py-3 rounded-xl bg-[#2d2d2d] text-white font-semibold hover:bg-black transition-colors shadow-lg"
              >
                Publicar
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}