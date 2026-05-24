import { useState, useEffect } from 'react';
import { FolderCard } from './FolderCard';
import { FolderEditorCell } from './FolderEditorCell';
import { SavedPreview } from './SavedPreview';
import { SectionTitle } from './SectionTitle';
import { SelectionButtonsGroup } from './SelectionButtonsGroup';
import { createFolder, renameFolder } from '../../services/connections-studentspace';
import type { Folder, SavedPost } from '../../models/student_space/student_space.model';

const toggleInSet = (prev: Set<number>, id: number): Set<number> => {
  const next = new Set(prev);
  next.has(id) ? next.delete(id) : next.add(id);
  return next;
};

interface SavedGridProps {
  folders: Folder[];
  savedPosts: SavedPost[];
  currentFolderId: number;
  totalFolderCount: number;
  pinnedPostIds?: Set<number>;
  onFolderAdded: (newFolder: Folder) => void;
  onFolderRenamed: (updatedFolder: Folder) => void;
  onFolderClick: (folder: Folder) => void;
  onPostClick: (savedPost: SavedPost) => void;
  onPinToggle?: (savedPost: SavedPost, isPinned: boolean) => void;
  onDeleteItems?: (folders: Folder[], savedPosts: SavedPost[]) => void;
}

export const SavedGrid = ({
  folders, savedPosts, currentFolderId, totalFolderCount, pinnedPostIds = new Set(),
  onFolderAdded, onFolderRenamed, onFolderClick, onPostClick, onPinToggle, onDeleteItems,
}: SavedGridProps) => {
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [isSelecting, setIsSelecting] = useState(false);
  const [renamingFolder, setRenamingFolder] = useState<Folder | null>(null);
  const [selectedFolderIds, setSelectedFolderIds] = useState<Set<number>>(new Set());
  const [selectedSavedPostIds, setSelectedSavedPostIds] = useState<Set<number>>(new Set());

  const reset = () => {
    setIsSelecting(false);
    setRenamingFolder(null);
    setSelectedFolderIds(new Set());
    setSelectedSavedPostIds(new Set());
  };

  useEffect(() => { reset(); }, [currentFolderId]);

  const handleSaveNewFolder = async (folderName: string) => {
    try {
      const newFolder = await createFolder(folderName, currentFolderId);
      if (newFolder) onFolderAdded(newFolder);
    } catch (error) {
      console.error('Error al crear carpeta:', error);
    } finally {
      setIsAddingNew(false);
    }
  };

  const handleRenameFolder = async (newName: string) => {
    if (!renamingFolder) return;
    try {
      const updated = await renameFolder(renamingFolder.id, newName);
      if (updated) onFolderRenamed(updated);
    } catch (error) {
      console.error('Error al renombrar carpeta:', error);
    } finally {
      setRenamingFolder(null);
    }
  };

  const handleDelete = () => {
    const selectedFolders = folders.filter(f => selectedFolderIds.has(f.id));
    const selectedPosts = savedPosts.filter(sp => selectedSavedPostIds.has(sp.id));
    onDeleteItems?.(selectedFolders, selectedPosts);
    reset();
  };

  const handleRenameRequest = () => {
    const folder = folders.find(f => selectedFolderIds.has(f.id));
    if (!folder) return;
    setRenamingFolder(folder);
    setIsSelecting(false);
    setSelectedFolderIds(new Set());
    setSelectedSavedPostIds(new Set());
  };

  const selectedCount = selectedFolderIds.size + selectedSavedPostIds.size;
  const canRename = selectedFolderIds.size === 1 && selectedSavedPostIds.size === 0;
  const existingFolderNames = folders.map(f => f.name);
  const renameExistingNames = renamingFolder
    ? existingFolderNames.filter(n => n !== renamingFolder.name)
    : existingFolderNames;

  const isEmpty = folders.length === 0 && savedPosts.length === 0 && !isAddingNew && !renamingFolder;

  return (
    <section className="mb-10">
      <SectionTitle title="Mi Espacio">
        <SelectionButtonsGroup
          isSelecting={isSelecting}
          selectedCount={selectedCount}
          canRename={canRename}
          isAddingNew={isAddingNew}
          atFolderLimit={totalFolderCount >= 100}
          onCancelSelection={reset}
          onDelete={handleDelete}
          onRename={handleRenameRequest}
          onSelectMode={() => setIsSelecting(true)}
          onAddNewFolder={() => setIsAddingNew(true)}
        />
      </SectionTitle>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {isAddingNew && (
          <FolderEditorCell
            existingNames={existingFolderNames}
            initialValue=""
            onSave={handleSaveNewFolder}
            onCancel={() => setIsAddingNew(false)}
          />
        )}

        {folders.map(folder =>
          renamingFolder?.id === folder.id ? (
            <FolderEditorCell
              key={`folder-${folder.id}`}
              existingNames={renameExistingNames}
              initialValue={renamingFolder.name}
              onSave={handleRenameFolder}
              onCancel={() => setRenamingFolder(null)}
            />
          ) : (
            <FolderCard
              key={`folder-${folder.id}`}
              folder={folder}
              onClick={() => onFolderClick(folder)}
              isSelecting={isSelecting}
              isSelected={selectedFolderIds.has(folder.id)}
              onSelect={() => setSelectedFolderIds(prev => toggleInSet(prev, folder.id))}
            />
          )
        )}

        {savedPosts.map(savedPost => (
          <SavedPreview
            key={`post-${savedPost.id}`}
            savedPost={savedPost}
            onClick={() => onPostClick(savedPost)}
            isPinned={pinnedPostIds.has(savedPost.id)}
            onPinToggle={onPinToggle}
            isSelecting={isSelecting}
            isSelected={selectedSavedPostIds.has(savedPost.id)}
            onSelect={() => setSelectedSavedPostIds(prev => toggleInSet(prev, savedPost.id))}
          />
        ))}
      </div>

      {isEmpty && (
        <div className="py-20 text-center w-full">
          <p className="text-gray-400 italic">Esta carpeta está vacía</p>
        </div>
      )}
    </section>
  );
};
