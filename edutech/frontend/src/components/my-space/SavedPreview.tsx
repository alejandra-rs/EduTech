import { CheckIcon } from '@heroicons/react/24/solid';
import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import { SavedPost } from '../../models/student_space/student_space.model';
import { PostLabel } from '../post-preview/labels';
import { PinnedButton } from './PinnedButton';

export interface SavedPreviewProps {
  savedPost: SavedPost;
  onClick: () => void;
  onPinToggle?: (savedPost: SavedPost, isPinned: boolean) => void;
  isSelecting?: boolean;
  isSelected?: boolean;
  onSelect?: () => void;
}

export function SavedPreview({ savedPost, onClick, onPinToggle, isSelecting, isSelected, onSelect }: SavedPreviewProps) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: `savedPost-${savedPost.id}`,
    data: { type: 'savedPost', savedPost },
    disabled: isSelecting,
  });

  const handleClick = () => isSelecting ? onSelect?.() : onClick();

  return (
    <div
      ref={setNodeRef}
      style={{
        transform: CSS.Translate.toString(transform),
        willChange: isDragging ? 'transform' : undefined,
      }}
      {...attributes}
      {...(isSelecting ? {} : listeners)}
      onClick={handleClick}
      className={`
        relative flex items-center gap-4 p-4 bg-white border rounded-xl shadow-sm cursor-pointer group
        ${isDragging ? 'opacity-40' : 'transition-all'}
        ${isSelected ? 'ring-2 ring-blue-500 border-blue-500' : 'border-gray-200 hover:shadow-md hover:border-blue-300'}
      `}
    >
      {isSelecting && (
        <div className={`absolute top-2 left-2 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${isSelected ? 'bg-blue-500 border-blue-500' : 'bg-white border-gray-300'}`}>
          {isSelected && <CheckIcon className="w-3 h-3 text-white" />}
        </div>
      )}
      <div className="w-10 flex-shrink-0 flex justify-center items-center scale-75 origin-left">
        <PostLabel type={savedPost.post.post_type} />
      </div>

      <div className="flex flex-col overflow-hidden w-full">
        <span className="font-semibold text-gray-800 truncate" title={savedPost.post.title}>
          {savedPost.post.title}
        </span>
        <span className="text-xs text-gray-400">
          {new Date(savedPost.saved_at).toLocaleDateString('es-ES')}
        </span>
      </div>
      {!isSelecting && (
        <PinnedButton
          savedPostId={savedPost.id}
          onPinToggle={(isPinned) => onPinToggle && onPinToggle(savedPost, isPinned)}
        />
      )}
    </div>
  );
}
