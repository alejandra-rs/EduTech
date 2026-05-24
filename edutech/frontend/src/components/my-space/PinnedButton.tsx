import { useState, useEffect } from 'react';
import { MapPinIcon as PinOutline } from '@heroicons/react/24/outline';
import { MapPinIcon as PinSolid } from '@heroicons/react/24/solid';
import { setPinned } from '../../services/connections-studentspace';

interface PinnedButtonProps {
  savedPostId: number;
  initialIsPinned: boolean;
  onPinToggle?: (isPinned: boolean) => void;
}

export const PinnedButton = ({ savedPostId, initialIsPinned, onPinToggle }: PinnedButtonProps) => {
  const [isPinned, setIsPinned] = useState<boolean>(initialIsPinned);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsPinned(initialIsPinned);
  }, [initialIsPinned]);

  const handleTogglePin = async (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    if (isLoading) return;
    setIsLoading(true);
    try {
      const newStatus = !isPinned;
      await setPinned(savedPostId, newStatus);
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
    <button type="button"
      onClick={handleTogglePin}
      disabled={isLoading}
      className={`p-2 rounded-full transition-all flex items-center justify-center ${isLoading ? 'opacity-50' : 'hover:bg-gray-100'}`}
      title={isPinned ? "Desfijar" : "Fijar"}
    >
      {isPinned ? (<PinSolid className="size-7 text-black" />) 
                : (<PinOutline className="size-7 text-black hover:scale-110" />)}
    </button>
  );
};