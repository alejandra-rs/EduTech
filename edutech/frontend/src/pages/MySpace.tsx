import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ChevronRightIcon, HomeIcon } from '@heroicons/react/24/solid';
import {
  DndContext, DragEndEvent, pointerWithin,
  useSensor, useSensors, PointerSensor,
} from '@dnd-kit/core';
import { TitlePage } from '../components/TitlePage';
import { useCurrentUser } from '../services/useCurrentUser';
import {
  getRootFolder, getFolder, getPinnedPosts,
  moveFolder, moveSavedPost,
  getSpaceStats, batchDeleteItems,
} from '../services/connections-studentspace';
import { Folder, FolderDetail, SavedPost } from '../models/student_space/student_space.model';
import { PostPreview, POST_TYPE_LABELS } from '../models/documents/post.model';
import { PinnedSection } from '../components/my-space/PinnedSection';
import { SavedGrid } from '../components/my-space/SavedGrid';
import { DroppablePath } from '../components/my-space/DroppablePath';
import { DeleteUndoToast } from '../components/my-space/DeleteUndoToast';

interface SpaceStats { folder_count: number; saved_post_count: number }
interface PendingDelete { folders: Folder[]; savedPosts: SavedPost[] }

const MySpace = () => {
  const { folderId } = useParams<{ folderId: string }>();
  const navigate = useNavigate();
  const { userData } = useCurrentUser();

  const [currentFolder, setCurrentFolder] = useState<FolderDetail | null>(null);
  const [pinnedPosts, setPinnedPosts] = useState<SavedPost[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [stats, setStats] = useState<SpaceStats | null>(null);
  const [pendingDelete, setPendingDelete] = useState<PendingDelete | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
  );

  useEffect(() => {
    if (!userData?.id) return;

    const fetchData = async () => {
      setLoading(true);
      try {
        const [pinned, statsData, folderData] = await Promise.all([
          getPinnedPosts(userData.id),
          getSpaceStats(userData.id),
          folderId
            ? getFolder(Number(folderId), userData.id)
            : getRootFolder(userData.id),
        ]);
        setPinnedPosts(pinned);
        setStats(statsData);
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
    if (!currentFolder) return;
    setCurrentFolder({ ...currentFolder, children: [newFolder, ...(currentFolder.children || [])] });
    setStats(s => s ? { ...s, folder_count: s.folder_count + 1 } : s);
  };

  const handleFolderMoved = (movedId: number) => {
    if (!currentFolder) return;
    setCurrentFolder({ ...currentFolder, children: currentFolder.children.filter(f => f.id !== movedId) });
  };

  const handleSavedPostMoved = (savedPostId: number) => {
    if (!currentFolder) return;
    setCurrentFolder({ ...currentFolder, saved_posts: currentFolder.saved_posts.filter(sp => sp.id !== savedPostId) });
  };

  const handlePinToggle = (savedPost: SavedPost, isPinned: boolean) => {
    setPinnedPosts(prev =>
      isPinned
        ? prev.some(p => p.id === savedPost.id) ? prev : [savedPost, ...prev]
        : prev.filter(p => p.id !== savedPost.id)
    );
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;
    const activeData = active.data.current;
    const overData   = over.data.current;
    if (overData?.type !== 'folder') return;
    if (activeData?.type === 'folder') {
      if (activeData.folder.id === overData.folder.id) return;
      await moveFolder(activeData.folder.id, overData.folder.id, userData!.id);
      handleFolderMoved(activeData.folder.id);
    } else if (activeData?.type === 'savedPost') {
      await moveSavedPost(activeData.savedPost.id, overData.folder.id, userData!.id);
      handleSavedPostMoved(activeData.savedPost.id);
    }
  };

  const handleDeleteItems = (folders: Folder[], savedPosts: SavedPost[]) => {
    if (!currentFolder) return;
    const folderIdSet = new Set(folders.map(f => f.id));
    const postIdSet = new Set(savedPosts.map(sp => sp.id));
    setCurrentFolder({
      ...currentFolder,
      children: currentFolder.children.filter(f => !folderIdSet.has(f.id)),
      saved_posts: currentFolder.saved_posts.filter(sp => !postIdSet.has(sp.id)),
    });
    setStats(s => s ? {
      folder_count: s.folder_count - folders.length,
      saved_post_count: s.saved_post_count - savedPosts.length,
    } : s);
    setPendingDelete({ folders, savedPosts });
  };

  const handleUndo = () => {
    if (!pendingDelete || !currentFolder) return;
    setCurrentFolder({
      ...currentFolder,
      children: [...pendingDelete.folders, ...currentFolder.children],
      saved_posts: [...pendingDelete.savedPosts, ...currentFolder.saved_posts],
    });
    setStats(s => s ? {
      folder_count: s.folder_count + pendingDelete.folders.length,
      saved_post_count: s.saved_post_count + pendingDelete.savedPosts.length,
    } : s);
    setPendingDelete(null);
  };

  const handleConfirmDelete = async () => {
    if (!pendingDelete || !userData) return;
    const folderIds = pendingDelete.folders.map(f => f.id);
    const savedPostIds = pendingDelete.savedPosts.map(sp => sp.id);
    setPendingDelete(null);
    await batchDeleteItems(folderIds, savedPostIds, userData.id);
  };

  if (loading) {
    return <div className="flex h-screen items-center justify-center text-gray-500">Cargando tu espacio...</div>;
  }

  const rootFolder = folderId ? currentFolder?.path?.[0] : currentFolder;
  const ancestorFolders = currentFolder?.path?.slice(1) ?? [];

  return (
    <DndContext sensors={sensors} onDragEnd={handleDragEnd} collisionDetection={pointerWithin}>
      <div className="flex flex-col h-screen w-full bg-gray-50 overflow-hidden">
        <div className="shrink-0 bg-white shadow-sm">
          <TitlePage
            PageName={folderId ? currentFolder?.name || "Cargando..." : "Mi Espacio"}
            backLabel="Inicio"
            onBack={() => navigate('/')}
          >
            {stats && (
              <div className={`flex items-center gap-2 text-xs shrink-0 ml-4 ${stats.folder_count > 5 ? "text-red-500" : "text-gray-500"}`}>
                {stats.folder_count} / 100 carpetas
              </div>
            )}
          </TitlePage>
          <div className="flex items-center px-8 py-3 text-sm text-gray-500 bg-gray-50/50 border-b border-gray-100">
            <div className="flex items-center flex-1 min-w-0">
              {folderId && rootFolder ? (
                <DroppablePath folderId={rootFolder.id} folderName={rootFolder.name} to="/mi-espacio">
                  <HomeIcon className="w-4 h-4" /> Mi Espacio
                </DroppablePath>
              ) : (
                <Link to="/mi-espacio" className="hover:text-blue-600 flex items-center gap-1 transition-colors px-1 py-0.5">
                  <HomeIcon className="w-4 h-4" /> Mi Espacio
                </Link>
              )}
              {ancestorFolders.map((folder) => (
                <div key={folder.id} className="flex items-center">
                  <ChevronRightIcon className="w-4 h-4 mx-1 text-gray-400" />
                  <DroppablePath
                    folderId={folder.id}
                    folderName={folder.name}
                    to={`/mi-espacio/directorio/${folder.id}`}
                  >
                    {folder.name}
                  </DroppablePath>
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
        </div>

        <div className="flex-grow overflow-y-auto custom-scrollbar px-8 py-8">
          <div className="max-w-7xl mx-auto space-y-10">
            {currentFolder?.depth == 1 &&
              <PinnedSection posts={pinnedPosts} onPostClick={handlePostClick} />
            }

            {currentFolder && (
              <SavedGrid
                folders={currentFolder.children || []}
                savedPosts={currentFolder.saved_posts}
                currentFolderId={currentFolder.id}
                studentId={userData!.id}
                onFolderAdded={handleFolderAdded}
                onFolderClick={(folder) => navigate(`/mi-espacio/directorio/${folder.id}`)}
                onPostClick={(savedPost) => handlePostClick(savedPost.post)}
                onPinToggle={handlePinToggle}
                onDeleteItems={handleDeleteItems}
              />
            )}
          </div>
        </div>
      </div>

      {pendingDelete && (
        <DeleteUndoToast
          count={pendingDelete.folders.length + pendingDelete.savedPosts.length}
          onUndo={handleUndo}
          onConfirm={handleConfirmDelete}
        />
      )}
    </DndContext>
  );
};

export default MySpace;
