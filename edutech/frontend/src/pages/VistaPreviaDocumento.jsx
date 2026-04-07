import VisorPDF from '../components/VisorPDF';
import { TitlePage } from '../components/TitlePage';
import { getDocument } from '@services/connections';
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { DocumentInfo } from '../components/DocumentInfo';
import { CommentsSections } from '../components/CommentsSections.jsx';

export default function VistaPreviaDocumento() {
  
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
    if (postId){
      cargarDocumento();
    }
  }, [postId]);

  return (
    <div className="flex h-screen w-full bg-white font-sans">
      <div className="flex-1 flex flex-col h-full bg-transparent">
        <div className="w-full shrink-0">
          <TitlePage PageName={"asignatura"} onBack={() => navigate(-1)} />
        </div>
        <div className="flex-1 flex flex-col lg:flex-row w-full h-full">
          <div className="w-full h-[60vh] lg:h-full lg:w-[30%] xl:w-[35%] flex items-center justify-center p-2 lg:p-6 shrink-0 bg-transparent overflow-hidden">
            <div className="w-full h-full flex items-center justify-center">
              <VisorPDF pdfUrl={document?.pdf?.file} />
            </div>
          </div>
          <div className="flex-1 w-full h-full overflow-y-auto custom-scrollbar bg-transparent">
            <div className="p-8 md:p-12 lg:pl-2 lg:pr-16 space-y-12 bg-transparent">
              <DocumentInfo document={document} />
              <CommentsSections documentId={postId} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}