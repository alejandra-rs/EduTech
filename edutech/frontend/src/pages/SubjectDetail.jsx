import { useParams, useNavigate } from "react-router-dom";
import { PlusCircleIcon } from "@heroicons/react/24/outline";
import SearchBar from "../components/SearchBar";
import BellButton from "../components/BellButton";
import Tabs from "../components/Tabs";
import PostGrid from "../components/PostGrid";
import NotebookFooter from "../components/Footer";
import { TitlePage } from "../components/TitlePage";
import { getPosts } from "@services/connections";
import { useState, useEffect } from 'react';

const SubjectDetail = () => {
  const { id, subjectId } = useParams();
  const navigate = useNavigate();

  const handlePostClick = (post) => {
  if (post.post_type === "PDF") {
    navigate(`/${id}/${subjectId}/documento/${post.id}`);
  } else if (post.post_type === "VID") {
    navigate(`/${id}/${subjectId}/video/${post.id}`);
  }
};

  const [posts, setPosts] = useState([]);
  const [activeTabs, setActiveTabs] = useState([]);

  useEffect(() => {
    const cargarPosts = async () => {
      try {
        const data = await getPosts(subjectId);
        setPosts(data);
      } catch (error) {
        console.error("Error al cargar los documentos de la asignatura", error);
      }
    };

    if (subjectId) {
      cargarPosts();
    }
  }, [subjectId]);


  const filteredPosts = posts.filter((post) => {
    if (activeTabs.length === 0) return true;
    const traductorTipos = {
      "PDF": "pdf",
      "VID": "video"
    };
    return activeTabs.includes(traductorTipos[post.post_type]); 
  });

  return (
    <div className="flex flex-col h-screen w-full bg-white overflow-hidden">
      <div className="shrink-0 bg-white ">
        <TitlePage PageName= "Asignaturas" onBack={() => navigate(-1)} >
          <button
            onClick={() => navigate(`/${id}/${subjectId}/upload`)}
            className="text-gray-700 hover:text-blue-600 transition-all duration-200 transform active:scale-75 hover:scale-110"
            title="Subir nuevo recurso"
          >
            <PlusCircleIcon className="w-10 h-10" />
          </button>
          <BellButton subjectId={subjectId} />
        </TitlePage>
        <SearchBar
          placeholder="Buscar en esta asignatura..."
          color="bg-slate-800"
        />
      </div>

      <div className="flex-grow overflow-y-auto custom-scrollbar flex flex-col">
        <div className="px-12 py-4 flex-grow">
          <div className="max-w-6xl mx-auto">
            <div className="mb-8 sticky top-0 bg-white/90 backdrop-blur-sm py-2 z-10">
              <Tabs activeTabs={activeTabs} onTabChange={setActiveTabs} />
            </div>

            <PostGrid 
              posts={filteredPosts} 
              onPostClick={handlePostClick} 
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubjectDetail;
