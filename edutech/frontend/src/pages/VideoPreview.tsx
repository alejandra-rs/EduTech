import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { getDocument } from '../services/connections-documents';
import { getCourse } from '../services/connections-courses';
import { TitlePage } from '../components/TitlePage';
import { DocumentInfo } from '../components/DocumentInfo';
import { CommentsSection } from '../components/interactions/CommentsSection';
import { getComments } from '../services/interactions/connections-comments';
import ReactionsContainer from '../components/interactions/ReactionsContainer';
import VideoViewer from '../components/VideoViewer';
import type { PostPreview } from '../models/documents/post.model';
import { SaveButton } from '../components/my-space/SaveButton';

export default function VideoPreview() {
  const navigate = useNavigate();
  const { id, subjectId, postId } = useParams<{ id: string; subjectId: string; postId: string }>();
  const [document, setDocument] = useState<PostPreview | null>(null);
  const [courseName, setCourseName] = useState("Asignatura");

  useEffect(() => {
    if (!postId) return;
    const load = async () => {
      try {
        const [courseData, data] = await Promise.all([
          getCourse(String(subjectId)),
          getDocument(Number(postId)),
        ]);
        setCourseName(courseData?.name || "Asignatura");
        setDocument(data);
      } catch (error) {
        console.error("Error al cargar el documento", error);
      }
    };
    load();
  }, [postId, subjectId]);

  return (
    <div className="flex flex-col h-screen w-full bg-gray-50 overflow-hidden font-sans">

      <header className="w-full shrink-0 bg-white shadow-sm z-10">
        <TitlePage PageName={courseName} onBack={() => navigate(`/${id}/${subjectId}/post`)}>
          <SaveButton postId={Number(postId)} />
        </TitlePage>
      </header>

      <main className="flex-1 w-full max-w-[95%] xl:max-w-[85%] mx-auto p-4 md:p-6 flex flex-col lg:flex-row gap-8 overflow-hidden">

        <div className="flex-[7] flex flex-col overflow-y-auto custom-scrollbar pb-10">
          <div className="w-full aspect-video bg-black rounded-3xl shadow-2xl mb-6">
            <VideoViewer videoUrl={(document as { vid?: { vid?: string } } | null)?.vid?.vid} />
          </div>

          <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 space-y-6">
            <DocumentInfo document={document} showDownload={false} />
            <hr className="border-gray-100" />
            <ReactionsContainer postId={document?.id ?? 0} />
          </div>
        </div>

        <aside className="lg:w-[350px] xl:w-[450px] shrink-0 bg-white p-6 rounded-3xl shadow-sm border border-gray-100 self-start">
          <CommentsSection id={postId} fetchComments={getComments} />
        </aside>

      </main>
    </div>
  );
}
