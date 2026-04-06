import VisorPDF from '../components/VisorPDF.jsx';
import { TitlePage } from '../components/TitlePage.jsx';
import { getDocument } from '@services/connections';
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { DocumentInfo } from '../components/DocumentInfo.jsx';
import { CommentsSections } from '../components/CommentsSections.jsx';
import VisorVideo from '../components/VisorVideo';

export default function VistaPreviaDocumento() {
  
  const navigate = useNavigate();
  const { id, subjectId, postId } = useParams();
  const [document, setDocument] = useState(null);
  
  useEffect(() => {
    const cargarDocumento = async () => {
      try {
        const data = await getDocument(postId);
        console.log("Documento obtenido de la API:", data);
        setDocument(data);
      } catch (error) {
        console.error("Error al cargar el documento", error);
      }
    };
    if (postId){
      cargarDocumento();
    }
  }, [postId]);
  console.log("Documento cargado:", document);
  return (
<div className="flex flex-col h-screen w-full bg-gray-50 overflow-hidden font-sans">
      
      <div className="w-full shrink-0 bg-white shadow-sm z-10">
        <TitlePage PageName={"asignatura"} onBack={() => navigate(-1)} />
      </div>
      <div className="flex-1 w-full max-w-[1600px] mx-auto p-4 md:p-6 flex flex-col overflow-hidden gap-4">
        <div className="flex-1 flex flex-col lg:flex-row gap-6 overflow-hidden">
          <div className="flex-[7] flex flex-col overflow-y-auto custom-scrollbar pb-10 pr-2">
            <div className="w-full shrink-0 bg-black rounded-2xl overflow-hidden shadow-md">
              <VisorVideo videoUrl={document?.vid?.vid} />
            </div>
            <div className="bg-white p-6 rounded-2xl mt-4 shadow-sm border border-gray-100">
              <DocumentInfo document={document} />
            </div>

          </div>
          <div className="flex-[3] flex flex-col bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="flex-1 overflow-y-auto custom-scrollbar p-6">
              <CommentsSections documentId={postId} />
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
