import VisorPDF from '../components/VisorPDF';
import Descargar from '../components/Descargar';
import Like from '../components/Like';
import Dislike from '../components/Dislike';
import Views from '../components/Views';
import Comentario from '../components/Comentario';
import { TitlePage } from '../components/TitlePage';
import ReportButton from '../components/ReportButton';
import ModalComentario from '../components/PopUp';
import { useState } from 'react';
import { getDocument } from '@services/connections';
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

export default function VistaPreviaDocumento() {
  
  const { id, subjectId, postId } = useParams();
  const [document, setDocument] = useState(null);
  const [comments, setComments] = useState(null);
  const [likes, setLikes] = useState(null);
  const [dislikes, setDislikes] = useState(null);
  const [views, setViews] = useState(null);

  useEffect(() => {
    const cargarDocumento = async () => {
      try {
        const data = await getDocument(postId);
        setDocument(data);
        setComments(data.comments);
        setLikes(data.likes);
        setDislikes(data.dislikes);
        setViews(data.views);
      } catch (error) {
        console.error("Error al cargar el documento", error);
      }
    };
    if (postId){
      cargarDocumento();
    }
  }, [postId]);

  const asignaturaNombre = "Asignatura";
  const handleBack = () => window.history.back();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const handlePostComment = () => {
    console.log("Enviando comentario...");
    setIsModalOpen(false);
  };

  return (
    <div className="flex h-screen w-full bg-white overflow-hidden font-sans">
      <ModalComentario 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSubmit={handlePostComment} 
      />
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
                    <ReportButton />
                  </div>
                </div>
              </section>
              <section className="w-full pt-4 pb-24 bg-transparent">
                <div className="flex items-center justify-between mb-10">
                  <div className="flex items-center gap-4">
                    <h2 className="text-4xl font-bold text-gray-800">Comentarios:</h2>
                    <span 
                      onClick={() => setIsModalOpen(true)} 
                      className="text-4xl font-light text-gray-400 hover:text-black hover:scale-125 transition-all p-2 cursor-pointer select-none"
                    >
                      +
                    </span>
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