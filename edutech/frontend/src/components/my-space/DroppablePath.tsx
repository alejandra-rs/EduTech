import { Link } from 'react-router-dom';
import { useDroppable } from '@dnd-kit/core';

export function DroppablePath({ folderId, folderName, to, children }: {
  folderId: number;
  folderName: string;
  to: string;
  children: React.ReactNode;
}) {
  const { setNodeRef, isOver } = useDroppable({
    id: `crumb-${folderId}`,
    data: { type: 'folder', folder: { id: folderId, name: folderName } },
  });
  return (
    <span ref={setNodeRef} className={`rounded transition-colors ${isOver ? 'bg-blue-100 text-blue-700' : ''}`}>
      <Link to={to} className="hover:text-blue-600 flex items-center gap-1 transition-colors px-1 py-0.5">
        {children}
      </Link>
    </span>
  );
}
