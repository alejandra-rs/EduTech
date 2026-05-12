import { useState, useEffect } from 'react';
import { MapPinIcon as PinOutline } from '@heroicons/react/24/outline';
import { MapPinIcon as PinSolid } from '@heroicons/react/24/solid';
import { setPinned, getPinnedPosts } from '../../services/connections-studentspace';
import { useCurrentUser } from '../../services/useCurrentUser';

interface PinnedButtonProps {
  savedPostId: number;
  onPinToggle?: (isPinned: boolean) => void;
}

export const PinnedButton = ({ savedPostId, onPinToggle}: PinnedButtonProps) => {
  const [isPinned, setIsPinned] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState(true);
  const { userData } = useCurrentUser();

  useEffect(() => {
    if (!userData) return;

    const fetchPinStatus = async () => {
      setIsLoading(true);
      const pinnedList = await getPinnedPosts(userData.id);
      const found = pinnedList.some(post => post.id === savedPostId);
      setIsPinned(found);
      setIsLoading(false);
    };
    fetchPinStatus();
  }, [savedPostId, userData]);

  const handleTogglePin = async (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    if (isLoading || !userData) return;
    setIsLoading(true);
    try {
      const newStatus = !isPinned;
      await setPinned(savedPostId, newStatus, userData.id);
      setIsPinned(newStatus);
      if (onPinToggle) {
        onPinToggle(newStatus);
      }
    } catch (error) {
      console.error("Error al fijar/desfijar", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleTogglePin}
      disabled={isLoading || !userData}
      className={`p-2 rounded-full transition-all flex items-center justify-center ${isLoading || !userData ? 'opacity-50' : 'hover:bg-gray-100'}`}
      title={isPinned ? "Desfijar" : "Fijar"}
    >
      {isPinned ? (
        <PinSolid className="w-7 h-7 text-black" />
      ) : (
        <PinOutline className="w-7 h-7 text-black hover:scale-110" />
      )}
    </button>
  );
};