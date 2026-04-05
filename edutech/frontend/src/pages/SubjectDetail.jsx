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

  const dummyPosts = [
    {
      id: 1,
      title: "Apuntes Tema 1",
      type: "pdf",
      date: "2026-03-20",
      fileUrl: "https://www.w3.org/dummy.pdf",
    },
    {
      id: 2,
      title: "Resumen Final",
      type: "pdf",
      date: "2026-03-22",
      fileUrl: "https://www.w3.org/dummy2.pdf",
    },
    {
      id: 3,
      title: "Guía de estudio",
      type: "pdf",
      date: "2026-03-23",
      fileUrl: "https://www.w3.org/dummy3.pdf",
    },
    {
      id: 4,
      title: "Examen 2025",
      type: "pdf",
      date: "2026-03-24",
      fileUrl: "https://www.w3.org/dummy4.pdf",
    },
    {
      id: 5,
      title: "Explicación Tema 2",
      type: "vid",
      date: "2026-03-21",
      fileUrl: "https://www.youtube.com/watch?v=7iobxzd_2wY&t=1s",
    },
    {
      id: 6,
      title: "Ejercicios Resueltos",
      type: "vid",
      date: "2026-03-25",
      fileUrl: "https://youtu.be/7iobxzd_2wY?si=W8AwakVp7J0a2XL_",
    },
  ];

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
