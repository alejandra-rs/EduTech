import { useState, useEffect } from 'react';
import { BookmarkIcon as BookmarkOutline } from '@heroicons/react/24/outline';
import { BookmarkIcon as BookmarkSolid } from '@heroicons/react/24/solid';
import { getSavedPostId, savePost, deleteSavedPost, getRootFolder } from '../../services/connections-studentspace';
import { DeleteUndoToast } from './DeleteUndoToast';

interface SaveButtonProps {
  postId: number;
}

export const SaveButton = ({ postId }: SaveButtonProps) => {
  const [savedId, setSavedId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [pendingDeleteId, setPendingDeleteId] = useState<number | null>(null);

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
    if (isLoading) return;

    if (savedId !== null) {
      const idToDelete = savedId;
      setSavedId(null);
      setPendingDeleteId(idToDelete);
    } else {
      setIsLoading(true);
      try {
        const folder = await getRootFolder();
        if (folder?.id) {
          const newSavedPost = await savePost(folder.id, postId);
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
    if (pendingDeleteId === null) return;
    const idToDelete = pendingDeleteId;
    setPendingDeleteId(null);
    try {
      await deleteSavedPost(idToDelete);
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
      <button type="button"
        onClick={handleToggleSave}
        disabled={isLoading}
        className={`p-2 rounded-full transition-all flex items-center justify-center ${isLoading ? 'opacity-50' : 'hover:bg-gray-100'}`}
        title={isSaved ? "Quitar de Mi Espacio" : "Guardar en Mi Espacio"}
      >
        {isSaved ? (<BookmarkSolid className="size-7 text-black" />) 
                 : (<BookmarkOutline className="size-7 text-black hover:scale-110" />)}
      </button>

      {pendingDeleteId !== null && (
        <DeleteUndoToast onUndo={handleUndo} onConfirm={handleConfirmDelete} />
      )}
    </>
  );
};
