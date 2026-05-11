import { useState, useEffect } from 'react';
import { BookmarkIcon as BookmarkOutline } from '@heroicons/react/24/outline';
import { BookmarkIcon as BookmarkSolid } from '@heroicons/react/24/solid';
import { getSavedPostId, savePost, deleteSavedPost, getRootFolder} from '../../services/connections-studentspace';
import { useCurrentUser } from '../../services/useCurrentUser';

interface SaveButtonProps {
  postId: number;
  onSavedStatusChange: (id: number | null) => void;
}

export const SaveButton = ({ postId, onSavedStatusChange}: SaveButtonProps) => {
  const [savedId, setSavedId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { userData } = useCurrentUser();

  useEffect(() => {
    if (!userData) return;

    const fetchInitialStatus = async () => {
      setIsLoading(true);
      const id = await getSavedPostId(postId, userData.id);
      setSavedId(id);
      onSavedStatusChange(id);
      setIsLoading(false);
    };
    
    fetchInitialStatus();
  }, [postId, userData]);

  const handleToggleSave = async () => {
    if (isLoading) return;
    
    setIsLoading(true);
    try {
      if (savedId !== null) {
        await deleteSavedPost(postId, userData!.id);
        setSavedId(null);
        onSavedStatusChange(null);
      } else {
        const folder = await getRootFolder(userData!.id);
        if (folder && folder.id) {
          const newSavedPost = await savePost(folder.id, postId, userData!.id);
          if (newSavedPost) {
            setSavedId(newSavedPost.id);
            onSavedStatusChange(newSavedPost.id);
          }
        }
      }
    } catch (error) {
      console.error("Error al guardar/borrar", error);
    } finally {
      setIsLoading(false);
    }
      }

  return (
    <button
      onClick={handleToggleSave}
      disabled={isLoading || !userData}
      className={`p-2 rounded-full transition-all flex items-center justify-center ${isLoading || !userData ? 'opacity-50' : 'hover:bg-gray-100'}`}
      title={savedId !== null ? "Quitar de Mi Espacio" : "Guardar en Mi Espacio"}
    >
      {savedId !== null ? (
        <BookmarkSolid className="w-7 h-7 text-black" /> 
      ) : (
        <BookmarkOutline className="w-7 h-7 text-black hover:scale-110" />
      )}
    </button>
  );
};