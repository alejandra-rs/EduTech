import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from 'react';
import SearchBar from "../components/SearchBar";
import BellButton from "../components/interactions/BellButton";
import Tabs from "../components/Tabs";
import PostGrid from "../components/PostGrid";
import { TitlePage } from "../components/TitlePage";
import { getPosts } from "../services/connections-documents";
import { getCourse } from "../services/connections-courses";
import { getYearById, getDegreeInfo } from "../services/connections-degrees";
import { ChatbotWidget } from "../components/chatbot/ChatbotWidget";
import { POST_TYPE_LABELS, PostPreview, PostType } from "../models/documents/post.model";
import { UploadMenuButton } from "../components/UploadMenuButton";

const TYPE_TO_TAB: Record<PostType, string> = { 
  PDF: "pdf", 
  VID: "video", 
  QUI: "cuestionario", 
  FLA: "flashcard" 
};

const CourseDetail = () => {
  const { id, subjectId } = useParams<{ id: string, subjectId: string }>();
  const navigate = useNavigate();

  const [posts, setPosts] = useState<PostPreview[]>([]);
  const [searchResults, setSearchResults] = useState<PostPreview[]| null>();
  const [activeTabs, setActiveTabs] = useState<string[]>([]);
  const [subjectName, setSubjectName] = useState<string>("Cargando...");
  const [degreeName, setDegreeName] = useState<string>("");

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        const [dataPosts, dataCourse] = await Promise.all([getPosts(Number(subjectId)), getCourse(Number(subjectId))]);
        setPosts(dataPosts);
        setSubjectName( dataCourse ? dataCourse.name: "Cargando");
      } catch (error) {
        console.error("Error al cargar datos:", error);
        setSubjectName("Asignatura");
      }
    };
    if (subjectId) cargarDatos();
  }, [subjectId]);

  useEffect(() => {
    if (!id) return;
    getYearById(Number(id))
      .then((year) => getDegreeInfo(year.degree))
      .then((degreeInfo) => setDegreeName(degreeInfo.name))
      .catch(() => {});
  }, [id]);


  const handlePostClick = (post: PostPreview) => {
    navigate(`/${id}/${subjectId}/${POST_TYPE_LABELS[post.post_type]}/${post.id}`);
  };

  const filteredPosts = (searchResults ?? posts).filter((post) => {
    if (activeTabs.length === 0) return true;
    return activeTabs.includes(TYPE_TO_TAB[post.post_type]);
  });



  return (
    <div className="flex flex-col h-screen w-full bg-white overflow-hidden">
      <div className="shrink-0 bg-white">
        <TitlePage
          PageName={subjectName}
          subtitle={degreeName}
          backLabel="Asignaturas"
          onBack={() => navigate(`/${id}/asignaturas`)}
        >
          <UploadMenuButton id={id} subjectId={subjectId} />
          <BellButton courseId={Number(subjectId)} />
        </TitlePage>
        <SearchBar
          placeholder="Buscar en esta asignatura..."
          color="bg-slate-800"
          courseId={subjectId}
          onSearch={setSearchResults}
        />
      </div>

      <div className="flex-grow overflow-y-auto custom-scrollbar flex flex-col">
        <div className="px-12 py-4 flex-grow">
          <div className="max-w-6xl mx-auto">
            <div className="mb-8 sticky top-0 bg-white/90 backdrop-blur-sm py-2 z-10">
              <Tabs activeTabs={activeTabs} onTabChange={setActiveTabs} />
            </div>
            <PostGrid posts={filteredPosts} onPostClick={handlePostClick} />
          </div>
        </div>
      </div>
      <ChatbotWidget courseId={subjectId} />
    </div>
  );
}
export default CourseDetail;
