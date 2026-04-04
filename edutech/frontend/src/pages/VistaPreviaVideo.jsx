import VisorVideo from '../components/VisorVideo';
import Like from '../components/Like';
import Dislike from '../components/Dislike';
import Views from '../components/Views';
import Comentario from '../components/Comentario';
import { TitlePage } from '../components/TitlePage';
import Input from '../components/Input';

export default function VistaPreviaVideo() {
  const asignaturaNombre = "Asignatura";
  const handleBack = () => window.history.back();
  const videoUrl = "https://www.youtube.com/watch?v=dQw4w9WgXcQ"; 

  return (
    <div className="flex h-screen w-full bg-white overflow-hidden font-sans">
      <input type="checkbox" id="modal-comentario" className="peer hidden" />
      <div className="fixed inset-0 z-50 hidden peer-checked:flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
        <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl p-8 animate-in fade-in zoom-in duration-200">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-2xl font-bold text-gray-800">Nuevo Comentario</h3>
            <label htmlFor="modal-comentario" className="text-gray-400 hover:text-black text-3xl cursor-pointer">&times;</label>
          </div>
          <form onSubmit={(e) => e.preventDefault()}>
            <Input label="Tu mensaje" placeholder="Escribe lo que piensas..." rows={5} />
            <div className="mt-8 flex gap-3">
              <label htmlFor="modal-comentario" className="flex-1 py-3 text-center rounded-xl border border-gray-200 text-gray-600 font-semibold hover:bg-gray-50 cursor-pointer transition-colors">
                Cancelar
              </label>
              <button type="submit" className="flex-1 py-3 rounded-xl bg-[#2d2d2d] text-white font-semibold hover:bg-black transition-colors shadow-lg">
                Publicar
              </button>
            </div>
          </form>
        </div>
      </div>
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        <div className="w-full shrink-0">
          <TitlePage PageName={asignaturaNombre} onBack={handleBack} />
        </div>
        <div className="flex-1 overflow-y-auto custom-scrollbar px-6 md:px-12 py-8">
          <div className="w-full space-y-10">
            <section className="w-full flex justify-center">
              <div className="w-full max-w-[1400px]">
                <VisorVideo videoUrl={videoUrl} />
              </div>
            </section>
            <section className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-gray-100 pb-6">
              <h1 className="text-5xl md:text-6xl font-bold text-gray-900 leading-none">Título</h1>
              <div className="flex flex-col items-end gap-2">
                <Views />
                <div className="flex items-center gap-6">
                  <Like />
                  <Dislike />
                </div>
              </div>
            </section>
            <section className="space-y-4">
              <h2 className="text-3xl font-bold text-gray-800">Descripción:</h2>
              <p className="text-xl text-gray-600 leading-relaxed">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod 
                tempor incididunt ut labore et dolore magna aliqua.
              </p>
            </section>
            <section className="pt-8 pb-20 border-t border-gray-100">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-4">
                  <h2 className="text-4xl font-bold text-gray-800">Comentarios:</h2>
                  <label 
                    htmlFor="modal-comentario" 
                    className="text-4xl font-light text-gray-400 hover:text-black hover:scale-110 transition-all cursor-pointer select-none"
                  >+</label>
                </div>
                <span className="text-xl text-gray-400 font-medium">(3)</span>
              </div>
              <div className="flex flex-col gap-4">
                <Comentario />
                <Comentario />
                <Comentario />
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}