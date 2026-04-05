import VisorVideo from '../components/VisorVideo';
import Like from '../components/Like';
import Dislike from '../components/Dislike';
import Views from '../components/Views';
import Comentario from '../components/Comentario';
import { TitlePage } from '../components/TitlePage';
import Input from '../components/Input';
import ReportButton from '../components/ReportButton';
import { useState } from 'react';
import ModalComentario from '../components/PopUp';

export default function VistaPreviaVideo() {
  const asignaturaNombre = "Asignatura";
  const handleBack = () => window.history.back();
  const videoUrl = "https://www.youtube.com/watch?v=dQw4w9WgXcQ"; 
  const [isModalOpen, setIsModalOpen] = useState(false);
  const handleCommentSubmit = () => {
    console.log("Comentario de video enviado");
    setIsModalOpen(false);
  };

  return (
    <div className="flex h-screen w-full bg-white overflow-hidden font-sans">
      <ModalComentario 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSubmit={handleCommentSubmit} 
      />
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
                <div className="flex items-center gap-4">
                  <Views />
                  <ReportButton />
                </div>
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