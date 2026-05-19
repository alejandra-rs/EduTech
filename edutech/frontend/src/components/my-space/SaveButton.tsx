import { useState, useEffect } from 'react';
import { BookmarkIcon as BookmarkOutline } from '@heroicons/react/24/outline';
import { BookmarkIcon as BookmarkSolid } from '@heroicons/react/24/solid';
import { getSavedPostId, savePost, deleteSavedPost, getRootFolder } from '../../services/connections-studentspace';
import { useCurrentUser } from '../../services/useCurrentUser';
import { DeleteUndoToast } from './DeleteUndoToast';

interface SaveButtonProps {
  postId: number;
}

export const SaveButton = ({ postId }: SaveButtonProps) => {
  const [savedId, setSavedId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [pendingDeleteId, setPendingDeleteId] = useState<number | null>(null);
  const { userData } = useCurrentUser();

  useEffect(() => {
    const fetchInitialStatus = async () => {
      setIsLoading(true);
      const id = await getSavedPostId(postId);
      setSavedId(id);
      setIsLoading(false);
    };
    fetchInitialStatus();
  }, [postId]);

  const handleToggleSave = async () => {
    if (isLoading || !userData) return;

    if (savedId !== null) {
      const idToDelete = savedId;
      setSavedId(null);
      setPendingDeleteId(idToDelete);
    } else {
      setIsLoading(true);
      try {
        const folder = await getRootFolder(userData.id);
        if (folder?.id) {
          const newSavedPost = await savePost(folder.id, postId, userData.id);
          if (newSavedPost) setSavedId(newSavedPost.id);
        }
      } catch (error) {
        console.error("Error al guardar", error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleConfirmDelete = async () => {
    if (pendingDeleteId === null || !userData) return;
    const idToDelete = pendingDeleteId;
    setPendingDeleteId(null);
    try {
      await deleteSavedPost(idToDelete, userData.id);
    } catch (error) {
      console.error("Error al eliminar guardado", error);
    }
  };

  const handleUndo = () => {
    setSavedId(pendingDeleteId);
    setPendingDeleteId(null);
  };

  const isSaved = savedId !== null || pendingDeleteId !== null;

  return (
    <>
      <button
        onClick={handleToggleSave}
        disabled={isLoading || !userData}
        className={`p-2 rounded-full transition-all flex items-center justify-center ${isLoading || !userData ? 'opacity-50' : 'hover:bg-gray-100'}`}
        title={isSaved ? "Quitar de Mi Espacio" : "Guardar en Mi Espacio"}
      >
        {isSaved ? (
          <BookmarkSolid className="w-7 h-7 text-black" />
        ) : (
          <BookmarkOutline className="w-7 h-7 text-black hover:scale-110" />
        )}
      </button>

      {pendingDeleteId !== null && (
        <DeleteUndoToast onUndo={handleUndo} onConfirm={handleConfirmDelete} />
      )}
    </>
  );
};
