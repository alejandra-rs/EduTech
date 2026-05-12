import { FolderIcon, CheckIcon } from '@heroicons/react/24/solid';
import { useDraggable, useDroppable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import { Folder } from '../../models/student_space/student_space.model';

export interface FolderCardProps {
  folder: Folder;
  onClick: (folder: Folder) => void;
  isSelecting?: boolean;
  isSelected?: boolean;
  onSelect?: () => void;
}

export function FolderCard({ folder, onClick, isSelecting, isSelected, onSelect }: FolderCardProps) {
  const { attributes, listeners, setNodeRef: setDragRef, transform, isDragging } =
    useDraggable({
      id: `folder-${folder.id}`,
      data: { type: 'folder', folder },
      disabled: isSelecting,
    });

  const { setNodeRef: setDropRef, isOver } = useDroppable({
    id: `folder-${folder.id}`,
    data: { type: 'folder', folder },
    disabled: isSelecting,
  });

  const setRef = (node: HTMLElement | null) => {
    setDragRef(node);
    setDropRef(node);
  };

  const handleClick = () => isSelecting ? onSelect?.() : onClick(folder);

  return (
    <div
      ref={setRef}
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
        ${isSelected ? 'ring-2 ring-blue-500 border-blue-500' : isOver ? 'border-blue-500 bg-blue-50 scale-105 shadow-md' : 'border-gray-200 hover:shadow-md hover:border-blue-300'}
      `}
    >
      {isSelecting && (
        <div className={`absolute top-2 left-2 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${isSelected ? 'bg-blue-500 border-blue-500' : 'bg-white border-gray-300'}`}>
          {isSelected && <CheckIcon className="w-3 h-3 text-white" />}
        </div>
      )}
      <FolderIcon className={`w-10 h-10 transition-colors ${isSelected ? 'text-blue-500' : isOver ? 'text-blue-500' : 'text-blue-400 group-hover:text-blue-500'}`} />
      <div className="flex flex-col overflow-hidden">
        <span className="font-semibold text-gray-800 truncate">{folder.name}</span>
        <span className="text-xs text-gray-400">
          {new Date(folder.created_at).toLocaleDateString('es-ES')}
        </span>
      </div>
    </div>
  );
}
