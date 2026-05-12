import { useState, useEffect } from 'react';
import { PlusIcon, FolderIcon, TrashIcon, XMarkIcon } from '@heroicons/react/24/outline';
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
  onDeleteItems?: (folders: Folder[], savedPosts: SavedPost[]) => void;
}

export const SavedGrid = ({
  folders,
  savedPosts,
  currentFolderId,
  studentId,
  onFolderAdded,
  onFolderClick,
  onPostClick,
  onPinToggle,
  onDeleteItems,
}: SavedGridProps) => {
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [isSelecting, setIsSelecting] = useState(false);
  const [selectedFolderIds, setSelectedFolderIds] = useState<Set<number>>(new Set());
  const [selectedSavedPostIds, setSelectedSavedPostIds] = useState<Set<number>>(new Set());

  useEffect(() => {
    setIsSelecting(false);
    setSelectedFolderIds(new Set());
    setSelectedSavedPostIds(new Set());
  }, [currentFolderId]);

  const handleSaveNewFolder = async (folderName: string) => {
    try {
      const newFolder = await createFolder(folderName, currentFolderId, studentId);
      if (newFolder) onFolderAdded(newFolder);
    } catch (error) {
      console.error("Error al crear carpeta:", error);
    } finally {
      setIsAddingNew(false);
    }
  };

  const toggleFolderSelect = (id: number) => {
    setSelectedFolderIds(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const toggleSavedPostSelect = (id: number) => {
    setSelectedSavedPostIds(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const cancelSelection = () => {
    setIsSelecting(false);
    setSelectedFolderIds(new Set());
    setSelectedSavedPostIds(new Set());
  };

  const handleDelete = () => {
    const selectedFolders = folders.filter(f => selectedFolderIds.has(f.id));
    const selectedPosts = savedPosts.filter(sp => selectedSavedPostIds.has(sp.id));
    onDeleteItems?.(selectedFolders, selectedPosts);
    cancelSelection();
  };

  const selectedCount = selectedFolderIds.size + selectedSavedPostIds.size;
  const existingFolderNames = folders.map(f => f.name);

  return (
    <section className="mb-10">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xs font-bold text-gray-400 uppercase tracking-wider">
          Mi Espacio
        </h2>
        <div className="flex items-center gap-2">
          {isSelecting ? (
            <>
              <button
                onClick={cancelSelection}
                className="p-1.5 text-gray-500 hover:text-gray-700 rounded-lg transition-colors flex items-center gap-1 text-sm"
              >
                <XMarkIcon className="w-4 h-4" />
                Cancelar
              </button>
              {selectedCount > 0 && (
                <button
                  onClick={handleDelete}
                  className="p-1.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg transition-colors flex items-center gap-1 text-sm font-medium"
                >
                  <TrashIcon className="w-4 h-4" />
                  Eliminar ({selectedCount})
                </button>
              )}
            </>
          ) : (
            <>
              <button
                onClick={() => setIsSelecting(true)}
                className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors text-sm"
              >
                Seleccionar
              </button>
              <button
                onClick={() => setIsAddingNew(true)}
                disabled={isAddingNew}
                className="p-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors flex items-center gap-1 text-sm font-medium"
              >
                <PlusIcon className="w-4 h-4" />
                <span>Nueva Carpeta</span>
              </button>
            </>
          )}
        </div>
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

        {folders.map((subfolder) => (
          <FolderCard
            key={`folder-${subfolder.id}`}
            folder={subfolder}
            onClick={() => onFolderClick(subfolder)}
            isSelecting={isSelecting}
            isSelected={selectedFolderIds.has(subfolder.id)}
            onSelect={() => toggleFolderSelect(subfolder.id)}
          />
        ))}

        {savedPosts.map((savedPost) => (
          <SavedPreview
            key={`post-${savedPost.id}`}
            savedPost={savedPost}
            onClick={() => onPostClick(savedPost)}
            onPinToggle={onPinToggle}
            isSelecting={isSelecting}
            isSelected={selectedSavedPostIds.has(savedPost.id)}
            onSelect={() => toggleSavedPostSelect(savedPost.id)}
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
