import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { getDocument } from '@services/connections';
import { TitlePage } from '../components/TitlePage';
import { DocumentInfo } from '../components/DocumentInfo';
import { CommentsSections } from '../components/CommentsSections';
import VisorVideo from '../components/VisorVideo';
import VisorPDF from '../components/VisorPDF';

export default function VistaPreviaVideo() {
  const navigate = useNavigate();
  const { id, subjectId, postId } = useParams();
  const [document, setDocument] = useState(null);

  useEffect(() => {
    const cargarDocumento = async () => {
      try {
        const data = await getDocument(postId);
        setDocument(data);
      } catch (error) {
        console.error("Error al cargar el documento", error);
      }
    };
    if (postId) cargarDocumento();
  }, [postId]);


  return (
    <div className="flex flex-col h-screen w-full bg-gray-50 overflow-hidden font-sans">
      
      <header className="w-full shrink-0 bg-white shadow-sm z-10">
        <TitlePage PageName={"Asignatura"} onBack={() => navigate(-1)} />
      </header>

      <main className="flex-1 w-full max-w-[95%] xl:max-w-[85%] mx-auto p-4 md:p-6 flex flex-col lg:flex-row gap-8 overflow-hidden">
        
        <div className="flex-[7] flex flex-col overflow-y-auto custom-scrollbar pb-10">
          <div className="w-full aspect-video bg-black rounded-3xl overflow-hidden shadow-2xl mb-6">
            {document?.post_type === 'vid' || document?.vid ? (
              <VisorVideo videoUrl={document?.vid?.vid} />
            ) : (
              <VisorPDF pdfUrl={document?.pdf?.file} />
            )}
          </div>
          
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
            <DocumentInfo document={document} />
          </div>
        </div>

        <aside className="lg:w-[350px] xl:w-[450px] shrink-0 bg-white p-6 rounded-3xl shadow-sm border border-gray-100 self-start">
          <CommentsSections documentId={postId} />
        </aside>

      </main>
    </div>
  );
}