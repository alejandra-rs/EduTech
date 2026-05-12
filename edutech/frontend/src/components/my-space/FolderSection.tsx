import { useState } from 'react';
import { PlusIcon, FolderIcon } from '@heroicons/react/24/outline';
import { FolderCard } from './FolderCard';
import { FolderInlineEditor } from './FolderInlineEditor';
import { createFolder } from '../../services/connections-studentspace';
import { useNavigate } from 'react-router-dom';
import { Folder } from '../../models/student_space/student_space.model';

interface FolderSectionProps {
  folders: Folder[];
  currentFolderId: number;
  studentId: number;
  onFolderAdded: (newFolder: Folder) => void;
}

export const FolderSection = ({ folders, currentFolderId, studentId, onFolderAdded }: FolderSectionProps) => {
  const navigate = useNavigate();
  const [isAddingNew, setIsAddingNew] = useState(false);

  const handleSaveNewFolder = async (folderName: string) => {
    try {
      const newFolder = await createFolder(folderName, currentFolderId, studentId);
      if (newFolder) {
        onFolderAdded(newFolder);
      }
    } catch (error) {
      console.error("Error al crear carpeta:", error);
    } finally {
      setIsAddingNew(false);
    }
  };

  const existingFolderNames = folders.map(f => f.name);

  return (
    <section className="mb-10">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xs font-bold text-gray-400 uppercase tracking-wider">
          Carpetas
        </h2>
        <button
          onClick={() => setIsAddingNew(true)}
          disabled={isAddingNew}
          className="p-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors flex items-center gap-1 text-sm font-medium"
        >
          <PlusIcon className="w-4 h-4" />
          <span>Nueva</span>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        
        {isAddingNew && (
          <div className="flex items-center gap-3 p-4 bg-white border-2 border-dashed border-blue-400 rounded-xl shadow-sm">
            <FolderIcon className="w-8 h-8 text-blue-400 shrink-0" />
            <FolderInlineEditor
              existingNames={existingFolderNames}
              onSave={handleSaveNewFolder}
              onCancel={() => setIsAddingNew(false)}
            />
          </div>
        )}

        {folders?.map((subfolder) => (
          <FolderCard 
            key={subfolder.id} 
            folder={subfolder} 
            onClick={() => navigate(`/myspace/folder/${subfolder.id}`)} 
          />
        ))}

      </div>
    </section>
  );
};