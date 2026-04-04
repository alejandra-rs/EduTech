import VisorPDF from '../components/VisorPDF';
import Descargar from '../components/Descargar';
import Like from '../components/Like';
import Dislike from '../components/Dislike';
import Views from '../components/Views';
import Comentario from '../components/Comentario';
import { TitlePage } from '../components/TitlePage';
import Input from '../components/Input';

export default function VistaPreviaDocumento() {
  const asignaturaNombre = "Asignatura";
  const handleBack = () => window.history.back();

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
      <div className="flex-1 flex flex-col h-full overflow-hidden bg-transparent">
        <div className="w-full shrink-0">
          <TitlePage PageName={asignaturaNombre} onBack={handleBack} />
        </div>
        <div className="flex-1 flex flex-col lg:flex-row w-full h-full overflow-hidden">
          <div className="w-full h-[60vh] lg:h-full lg:w-[30%] xl:w-[35%] flex items-center justify-center p-2 lg:p-6 shrink-0 bg-transparent overflow-hidden">
            <div className="w-full h-full flex items-center justify-center">
              <VisorPDF />
            </div>
          </div>
          <div className="flex-1 w-full h-full overflow-y-auto custom-scrollbar bg-transparent">
            <div className="p-8 md:p-12 lg:pl-2 lg:pr-16 space-y-12 bg-transparent">
              <section className="flex flex-col bg-transparent">
                <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">Título</h1>
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">Descripción:</h2>
                <p className="text-xl text-gray-600 leading-relaxed mb-10 max-w-none">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod 
                  tempor incididunt ut labore et dolore magna aliqua.
                </p>
                <div className="mb-10 w-full"> 
                  <Descargar />
                </div>
                <div className="flex items-center justify-between w-full pt-8 border-t border-gray-100">
                  <Views />
                  <div className="flex items-center gap-8">
                    <Like />
                    <Dislike />
                  </div>
                </div>
              </section>
              <section className="w-full pt-4 pb-24 bg-transparent">
                <div className="flex items-center justify-between mb-10">
                  <div className="flex items-center gap-4">
                    <h2 className="text-4xl font-bold text-gray-800">Comentarios:</h2>
                    <label 
                      htmlFor="modal-comentario" 
                      className="text-4xl font-light text-gray-400 hover:text-black hover:scale-125 transition-all p-2 cursor-pointer select-none"
                    >
                      +
                    </label>
                  </div>
                  <span className="text-xl text-gray-400 font-medium">(3)</span>
                </div>
                <div className="flex flex-col gap-6 w-full">
                  <Comentario />
                  <Comentario />
                  <Comentario />
                </div>
              </section>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}