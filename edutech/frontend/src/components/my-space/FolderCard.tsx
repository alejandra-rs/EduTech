import { FolderIcon } from '@heroicons/react/24/solid';
import { Folder } from '../../models/student_space/student_space.model';

export interface FolderCardProps {
  folder: Folder;
  onClick: (folder: Folder) => void;
}

export function FolderCard({ folder, onClick }: FolderCardProps) {
  return (
    <div
      onClick={() => onClick(folder)}
      className="flex items-center gap-4 p-4 bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md hover:border-blue-300 cursor-pointer transition-all group"
    >
      <FolderIcon className="w-10 h-10 text-blue-400 group-hover:text-blue-500 transition-colors" />
      <div className="flex flex-col overflow-hidden">
        <span className="font-semibold text-gray-800 truncate">{folder.name}</span>
        <span className="text-xs text-gray-400">
          {new Date(folder.created_at).toLocaleDateString('es-ES')}
        </span>
      </div>
    </div>
  );
}