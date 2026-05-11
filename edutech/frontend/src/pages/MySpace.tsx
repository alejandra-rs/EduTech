import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ChevronRightIcon, HomeIcon } from '@heroicons/react/24/solid';
import { TitlePage } from '../components/TitlePage';
import PostGrid from '../components/PostGrid';
import { useCurrentUser } from '../services/useCurrentUser';
import { getRootFolder, getFolder, getPinnedPosts } from '../services/connections-studentspace';
import { Folder, FolderDetail, SavedPost } from '../models/student_space/student_space.model';
import { PostPreview, POST_TYPE_LABELS } from '../models/documents/post.model';
import { PinnedSection } from '../components/my-space/PinnedSection';
import { FolderSection } from '../components/my-space/FolderSection';

const MySpace = () => {
  const { folderId } = useParams<{ folderId: string }>();
  const navigate = useNavigate();
  const { userData } = useCurrentUser();

  const [currentFolder, setCurrentFolder] = useState<FolderDetail | null>(null);
  const [pinnedPosts, setPinnedPosts] = useState<SavedPost[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (!userData?.id) return;

    const fetchData = async () => {
      setLoading(true);
      try {
        const pinned = await getPinnedPosts(userData.id);
        setPinnedPosts(pinned);

        let folderData;
        if (folderId) {
          folderData = await getFolder(Number(folderId), userData.id);
        } else {
          folderData = await getRootFolder(userData.id);
        }
        setCurrentFolder(folderData);

      } catch (error) {
        console.error("Error cargando MySpace:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [folderId, userData?.id]);

  const handlePostClick = (post: PostPreview) => {
    navigate(`/${post.year}/${post.course}/${POST_TYPE_LABELS[post.post_type]}/${post.id}`);
  };

  const handleFolderAdded = (newFolder: Folder) => {
    if (currentFolder) {
      setCurrentFolder({
        ...currentFolder,
        children: [newFolder, ...(currentFolder.children || [])]
      });
    }
  };

  const pinnedPostPreviews = pinnedPosts.map(sp => sp.post);
  const folderPostPreviews = currentFolder?.saved_posts?.map(sp => sp.post) || [];

  if (loading) {
    return <div className="flex h-screen items-center justify-center text-gray-500">Cargando tu espacio...</div>;
  }

  return (
  <div className="flex flex-col h-screen w-full bg-gray-50 overflow-hidden">
    <div className="shrink-0 bg-white shadow-sm z-10">
      <TitlePage 
        PageName={folderId ? currentFolder?.name || "Cargando..." : "Mi Espacio"} 
        backLabel="Inicio" 
        onBack={() => navigate('/')} 
      />
      <div className="flex items-center px-8 py-3 text-sm text-gray-500 bg-gray-50/50 border-b border-gray-100">
        <Link to="/mi-espacio" className="hover:text-blue-600 flex items-center gap-1 transition-colors">
          <HomeIcon className="w-4 h-4" /> Mi Espacio
        </Link>
        {currentFolder?.path?.map((folder) => (
          <div key={folder.id} className="flex items-center">
            <ChevronRightIcon className="w-4 h-4 mx-1 text-gray-400" />
            <Link to={`/mi-espacio/directorio/${folder.id}`} className="hover:text-blue-600 transition-colors">
              {folder.name}
            </Link>
          </div>
        ))}
        {folderId && (
          <div className="flex items-center">
            <ChevronRightIcon className="w-4 h-4 mx-1 text-gray-400" />
            <span className="font-semibold text-gray-800">{currentFolder?.name}</span>
          </div>
        )}
      </div>
    </div>

    <div className="flex-grow overflow-y-auto custom-scrollbar px-8 py-8">
      <div className="max-w-7xl mx-auto space-y-10">
        
        <PinnedSection posts={pinnedPostPreviews} onPostClick={handlePostClick} />
        
        {currentFolder && (
          <FolderSection 
            folders={currentFolder.children || []} 
            currentFolderId={currentFolder.id} 
            studentId={userData!.id}
            onFolderAdded={handleFolderAdded}
          />
        )}

        <section>
          <h2 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">
            Archivos
          </h2>
          {folderPostPreviews.length > 0 ? (
            <PostGrid posts={folderPostPreviews} onPostClick={handlePostClick} />
          ) : (
            !currentFolder?.children?.length && (
              <div className="py-20 text-center">
                <p className="text-gray-400 italic">Esta carpeta está vacía</p>
              </div>
            )
          )}
        </section>

      </div>
    </div>
  </div>
  );
};

export default MySpace;