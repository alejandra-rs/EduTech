import { useNavigate } from "react-router-dom";
import { useState, useEffect } from 'react';
import { useCurrentUser } from "../services/useCurrentUser"; 
import SearchBar from "../components/SearchBar";
import Tabs from "../components/Tabs";
import PostGrid from "../components/PostGrid";
import { TitlePage } from "../components/TitlePage";
import { getMyPosts } from "../services/connections-documents.ts";

import { PostPreview } from "../models/post.model";

const MyDocuments = () => {
  const navigate = useNavigate();
  const { userData } = useCurrentUser();
  
  const [posts, setPosts] = useState<PostPreview[]>([]);
  const [searchResults, setSearchResults] = useState<PostPreview[] | null>(null);
  const [activeTabs, setActiveTabs] = useState<string[]>([]);

  useEffect(() => {
    const getDocuments = async () => {
      try {
        const dataPosts = await getMyPosts(userData.id);
        setPosts(dataPosts);
      } catch (error) {
        console.error("Error al cargar datos:", error);
      }
    };
    if (userData?.id) getDocuments();
  }, [userData?.id]);

  // 4. UNA NAVEGACIÓN LIMPIA Y SIN ASINCRONÍA
  const handlePostClick = (post: PostPreview) => {
    // Gracias al modelo, sabemos que post.year y post.course YA EXISTEN
    const basePath = `/${post.year}/${post.course}`;

    switch (post.post_type) {
      case "PDF": navigate(`${basePath}/documento/${post.id}`); break;
      case "VID": navigate(`${basePath}/video/${post.id}`); break;
      case "QUI": navigate(`${basePath}/quiz/${post.id}`); break;
      case "FLA": navigate(`${basePath}/flashcard/${post.id}`); break;
      default: console.warn("Tipo de post desconocido:", post.post_type);
    }
  };

  // 5. FILTRADO DIRECTO
  const filteredPosts = (searchResults ?? posts).filter((post) => {
    if (activeTabs.length === 0) return true;
    // Ya no necesitas el objeto TYPE_TO_TAB feo de antes.
    // Usamos el extendedType que inyectamos en connections.ts
    return activeTabs.includes(post.extendedType); 
  });

  return (
    <div className="flex flex-col h-screen w-full bg-white overflow-hidden">
      <div className="shrink-0 bg-white">
        <TitlePage
          PageName="Mis documentos"
          backLabel="Cursos"
          onBack={() => navigate(`/courses`)}
        />
        <SearchBar
          placeholder="Buscar en mis documentos..."
          color="bg-slate-800"
          studentId={userData?.id} // 6. AQUÍ COMPLETAMOS EL TODO
          onSearch={setSearchResults}
        />
      </div>

      <div className="flex-grow overflow-y-auto custom-scrollbar flex flex-col">
        <div className="px-12 py-4 flex-grow">
          <div className="max-w-6xl mx-auto">
            <div className="mb-8 sticky top-0 bg-white/90 backdrop-blur-sm py-2 z-10">
              <Tabs activeTabs={activeTabs} onTabChange={setActiveTabs} />
            </div>
            {/* PostGrid ya recibirá la lista limpia y filtrada de PostPreview */}
            <PostGrid posts={filteredPosts} onPostClick={handlePostClick} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyDocuments;