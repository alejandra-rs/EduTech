import { useNavigate } from "react-router-dom";
import { useState, useEffect } from 'react';
import { useCurrentUser } from "../services/useCurrentUser.ts";
import SearchBar from "../components/SearchBar";
import Tabs from "../components/Tabs";
import PostGrid from "../components/PostGrid";
import { TitlePage } from "../components/TitlePage";
import { getMyPosts, deleteDocument } from "../services/connections-documents.ts";
import { PostPreview, PostType } from "../models/documents/post.model.ts";

const TYPE_TO_TAB: Record<PostType, string> = { 
  PDF: "pdf", 
  VID: "video", 
  QUI: "cuestionario", 
  FLA: "flashcard" 
};


const MyDocuments = () => {
  const navigate = useNavigate();
  const { userData } = useCurrentUser();

  const [posts, setPosts] = useState<PostPreview[]>([]);
  const [searchResults, setSearchResults] = useState<PostPreview[] | null>(null);
  const [activeTabs, setActiveTabs] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userData?.id) return;
    getMyPosts(String(userData.id))
      .then(setPosts)
      .catch((err) => console.error("Error al cargar documentos:", err))
      .finally(() => setLoading(false));
  }, [userData?.id]);

  const handlePostClick = (post: PostPreview) =>
  {

      console.log(post);
    navigate(`/${post.year}/${post.course}/${post.extendedType}/${post.id}`);
  }

  const handleDelete = async (post: PostPreview) => {
    try {
      await deleteDocument(post.id, userData!.id);
      setPosts((prev) => prev.filter((p) => p.id !== post.id));
      if (searchResults) setSearchResults((prev) => prev!.filter((p) => p.id !== post.id));
    } catch (err) {
      console.error("Error al eliminar:", err);
    }
  };

  

  const filteredPosts = (searchResults ?? posts).filter((post) => {
    if (activeTabs.length === 0) return true;
    return activeTabs.includes(TYPE_TO_TAB[post.post_type]);
  });


  return (
    <div className="flex flex-col h-screen w-full bg-white overflow-hidden">
      <div className="shrink-0 bg-white">
        <TitlePage PageName="Mi material" backLabel="Inicio" onBack={() => navigate("/")} />
        <div className='p-4'>
          <SearchBar
            placeholder="Buscar en mis documentos..."
            color="bg-slate-800"
            studentId={String(userData?.id)}
            onSearch={setSearchResults}
          />
        </div>
      </div>

      <div className="flex-grow overflow-y-auto custom-scrollbar flex flex-col">
        <div className="px-12 py-4 flex-grow">
          <div className="max-w-6xl mx-auto">
            {loading ? (
              <p className="text-gray-500 italic text-center py-12">Cargando...</p>
            ) : (
              <>
                <div className="mb-8 sticky top-0 bg-white/90 backdrop-blur-sm py-2 z-10">
                  <Tabs activeTabs={activeTabs} onTabChange={setActiveTabs} />
                </div>
                <PostGrid posts={filteredPosts} onPostClick={handlePostClick} onDelete={handleDelete} />
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyDocuments;
