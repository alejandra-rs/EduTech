import { Link } from 'react-router-dom';
import { ChevronRightIcon, HomeIcon } from '@heroicons/react/24/solid';
import { DroppablePath } from './DroppablePath';
import { FolderDetail } from '../../models/student_space/student_space.model';

interface FolderPathProps {
  folderId: string | undefined;
  currentFolder: FolderDetail | null;
}

export function FolderPath({ folderId, currentFolder }: FolderPathProps) {
  const rootFolder = folderId ? currentFolder?.path?.[0] : currentFolder;
  const ancestorFolders = currentFolder?.path?.slice(1) ?? [];

  return (
    <div className="overflow-x-auto custom-scrollbar bg-gray-50/50 border-b border-gray-100">
      <div className="flex items-center px-8 py-3 text-sm text-gray-500 min-w-max">
        {folderId && rootFolder ? (
          <DroppablePath folderId={rootFolder.id} folderName={rootFolder.name} to="/mi-espacio">
            <HomeIcon className="w-4 h-4" /> Mi Espacio
          </DroppablePath>
        ) : (
          <Link to="/mi-espacio" className="hover:text-blue-600 flex items-center gap-1 transition-colors px-1 py-0.5">
            <HomeIcon className="w-4 h-4" /> Mi Espacio
          </Link>
        )}
        {ancestorFolders.map((folder) => (
          <div key={folder.id} className="flex items-center">
            <ChevronRightIcon className="w-4 h-4 mx-1 text-gray-400 shrink-0" />
            <DroppablePath
              folderId={folder.id}
              folderName={folder.name}
              to={`/mi-espacio/directorio/${folder.id}`}
            >
              {folder.name}
            </DroppablePath>
          </div>
        ))}
        {folderId && (
          <div className="flex items-center">
            <ChevronRightIcon className="w-4 h-4 mx-1 text-gray-400 shrink-0" />
            <span className="font-semibold text-gray-800 whitespace-nowrap">{currentFolder?.name}</span>
          </div>
        )}
      </div>
    </div>
  );
}
