import { useState } from 'react';
import { PlusIcon, FolderIcon } from '@heroicons/react/24/outline';
import { FolderCard } from './FolderCard';
import { SavedPreview } from './SavedPreview';
import { FolderInlineEditor } from './FolderInlineEditor';
import { createFolder } from '../../services/connections-studentspace';
import { Folder, SavedPost } from '../../models/student_space/student_space.model';

interface SavedGridProps {
  folders: Folder[];
  savedPosts: SavedPost[];
  currentFolderId: number;
  studentId: number;
  onFolderAdded: (newFolder: Folder) => void;
  onFolderClick: (folder: Folder) => void;
  onPostClick: (savedPost: SavedPost) => void;
  onPinToggle?: (savedPost: SavedPost, isPinned: boolean) => void;
}

export const SavedGrid = ({ 
  folders, 
  savedPosts: savedPosts, 
  currentFolderId, 
  studentId, 
  onFolderAdded,
  onFolderClick,
  onPostClick,
  onPinToggle
}: SavedGridProps) => {
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
          Mi Espacio
        </h2>
        <button
          onClick={() => setIsAddingNew(true)}
          disabled={isAddingNew}
          className="p-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors flex items-center gap-1 text-sm font-medium"
        >
          <PlusIcon className="w-4 h-4" />
          <span>Nueva Carpeta</span>
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
            key={`folder-${subfolder.id}`} 
            folder={subfolder} 
            onClick={() => onFolderClick(subfolder)} 
          />
        ))}

        {savedPosts?.map((savedPost) => (
          <SavedPreview 
            key={`post-${savedPost.id}`} 
            savedPost={savedPost} 
            onClick={() =>onPostClick(savedPost)}
            onPinToggle={onPinToggle}
          />
        ))}
      </div>
      
      {folders.length === 0 && savedPosts.length === 0 && !isAddingNew && (
        <div className="py-20 text-center w-full">
          <p className="text-gray-400 italic">Esta carpeta está vacía</p>
        </div>
      )}
    </section>
  );
};