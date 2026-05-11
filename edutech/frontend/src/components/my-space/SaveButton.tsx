// src/components/SaveButton.tsx
import { useState, useEffect } from 'react';
import { BookmarkIcon as BookmarkOutline } from '@heroicons/react/24/outline';
import { BookmarkIcon as BookmarkSolid } from '@heroicons/react/24/solid';
import { getSavedPostId, savePost, deleteSavedPost, getRootFolder} from '../../services/connections-studentspace';
import { useCurrentUser } from '../../services/useCurrentUser';

interface SaveButtonProps {
  postId: number;
}

export const SaveButton = ({ postId }: SaveButtonProps) => {
  const [savedId, setSavedId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { userData } = useCurrentUser();
  console.log(userData)

  useEffect(() => {
    if (!userData) return;

    const fetchInitialStatus = async () => {
      setIsLoading(true);
      const id = await getSavedPostId(postId, userData.id);
      setSavedId(id);
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
      } else {
        await getRootFolder(userData!.id).then(
          async (folder) =>{
            if (folder && folder.id) {
              const newSavedPost = await savePost(folder.id, postId, userData!.id);
              if (newSavedPost) {
                setSavedId(newSavedPost.id);
              } else {
                setSavedId(null);
              }
            } else {
              setSavedId(null);
            }
        }) ;
      }
    } catch (error) {
      console.error("Fallo en la operación de guardado/borrado", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleToggleSave}
      disabled={isLoading}
      className={`p-2 rounded-full transition-all flex items-center justify-center ${isLoading ? 'opacity-50' : 'hover:bg-gray-100'}`}
    >
      {savedId !== null ? (
        <BookmarkSolid className="w-7 h-7 text-black" /> 
      ) : (
        <BookmarkOutline className="w-7 h-7 text-black hover:scale-110" />
      )}
    </button>
  );
};