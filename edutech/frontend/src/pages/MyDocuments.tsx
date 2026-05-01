import { useNavigate } from "react-router-dom";
import { useState, useEffect } from 'react';
import { useCurrentUser } from "../services/useCurrentUser.ts"; 
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
        const dataPosts = await getMyPosts(userData!.id);
        setPosts(dataPosts);
      } catch (error) {
        console.error("Error al cargar datos:", error);
      }
    };
    if (userData?.id) getDocuments();
  }, [userData?.id]);

  const handlePostClick = (post: PostPreview) => navigate(`/${post.year}/${post.course}/${post.extendedType}/${post.id}`);

  const filteredPosts = (searchResults ?? posts).filter((post) => {
    if (activeTabs.length === 0) return true;
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
          studentId={userData?.id}
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
    </div>
  );
};

export default MyDocuments;