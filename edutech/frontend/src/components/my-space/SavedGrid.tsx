import { useState, useEffect } from 'react';
import { FolderIcon } from '@heroicons/react/24/outline';
import { FolderCard } from './FolderCard';
import { SavedPreview } from './SavedPreview';
import { FolderInlineEditor } from './FolderInlineEditor';
import { SectionTitle } from './SectionTitle';
import { SelectionButtonsGroup } from './SelectionButtonsGroup';
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
      <SectionTitle title="Mi Espacio">
        <SelectionButtonsGroup
          isSelecting={isSelecting}
          selectedCount={selectedCount}
          isAddingNew={isAddingNew}
          onCancelSelection={cancelSelection}
          onDelete={handleDelete}
          onSelectMode={() => setIsSelecting(true)}
          onAddNewFolder={() => setIsAddingNew(true)}
        />
      </SectionTitle>

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
