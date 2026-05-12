import PDFViewer from '../components/PDFViewer';
import { TitlePage } from '../components/TitlePage';
import { getDocument } from '../services/connections-documents';
import { getCourse } from '../services/connections-courses';
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { DocumentInfo } from '../components/DocumentInfo';
import { CommentsSection } from '../components/interactions/CommentsSection';
import type { PostPreview } from '../models/documents/post.model';

export default function DocumentPreview() {
  const navigate = useNavigate();
  const { id, subjectId, postId } = useParams<{ id: string; subjectId: string; postId: string }>();
  const [document, setDocument] = useState<PostPreview | null>(null);
  const [courseName, setCourseName] = useState("Asignatura");

  useEffect(() => {
    const cargarDocumento = async () => {
      try {
        const courseData = await getCourse(String(subjectId));
        setCourseName(courseData?.name || "Asignatura");
        const data = await getDocument(Number(postId));
        setDocument(data);
      } catch (error) {
        console.error("Error al cargar el documento", error);
      }
    };
    if (postId) cargarDocumento();
  }, [postId]);

  return (
    <div className="flex h-screen w-full bg-white font-sans">
      <div className="flex-1 flex flex-col h-full bg-transparent">
        <div className="w-full shrink-0">
          <TitlePage PageName={courseName} onBack={() => navigate(`/${id}/${subjectId}/post`)} />
        </div>
        <div className="flex-1 flex flex-col lg:flex-row w-full h-[calc(100vh-100px)]">
          <div className="w-full h-[60vh] lg:h-full lg:w-[30%] xl:w-[35%] flex items-center justify-center p-2 lg:p-6 shrink-0 bg-transparent overflow-hidden">
            <div className="w-full h-full flex items-center justify-center">
              <PDFViewer pdfUrl={(document as { pdf?: { file?: string } } | null)?.pdf?.file} />
            </div>
          </div>
          <div className="flex-1 w-full h-full overflow-y-auto custom-scrollbar bg-transparent pb-2">
            <div className="p-8 md:p-12 lg:pl-2 lg:pr-16 space-y-12 bg-transparent">
              <DocumentInfo document={document} />
              <CommentsSection id={postId} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
