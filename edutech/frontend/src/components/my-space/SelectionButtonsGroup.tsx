import { useState } from 'react';
import { PlusIcon, TrashIcon, XMarkIcon, PencilIcon } from '@heroicons/react/24/outline';

interface SelectionButtonsGroupProps {
  isSelecting: boolean;
  selectedCount: number;
  canRename: boolean;
  isAddingNew: boolean;
  atFolderLimit: boolean;
  onCancelSelection: () => void;
  onDelete: () => void;
  onRename: () => void;
  onSelectMode: () => void;
  onAddNewFolder: () => void;
}

export const SelectionButtonsGroup = ({
  isSelecting,
  selectedCount,
  canRename,
  isAddingNew,
  atFolderLimit,
  onCancelSelection,
  onDelete,
  onRename,
  onSelectMode,
  onAddNewFolder,
}: SelectionButtonsGroupProps) => {
  const [showLimitError, setShowLimitError] = useState(false);

  const handleAddNewFolder = () => {
    if (atFolderLimit) {
      setShowLimitError(true);
      setTimeout(() => setShowLimitError(false), 3000);
      return;
    }
    onAddNewFolder();
  };

  return (
    <div className="flex flex-col items-end gap-1">
      <div className="flex items-center gap-2">
        {isSelecting ? (
          <>
            <button type="button"
              onClick={onCancelSelection}
              className="p-1.5 text-gray-500 hover:text-gray-700 rounded-lg transition-colors flex items-center gap-1 text-sm"
            >
              <XMarkIcon className="size-4" />
              Cancelar
            </button>
            {selectedCount > 0 && (
              <>
                {canRename && (
                  <button type="button"
                    onClick={onRename}
                    className="p-1.5 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-lg transition-colors flex items-center gap-1 text-sm font-medium"
                  >
                    <PencilIcon className="size-4" />
                    Renombrar
                  </button>
                )}
                <button type="button"
                  onClick={onDelete}
                  className="p-1.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg transition-colors flex items-center gap-1 text-sm font-medium"
                >
                  <TrashIcon className="size-4" />
                  Eliminar ({selectedCount})
                </button>
              </>
            )}
          </>
        ) : (
          <>
            <button type="button"
              onClick={onSelectMode}
              className="p-1.5 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors text-sm"
            >
              Seleccionar…
            </button>
            <button type="button"
              onClick={handleAddNewFolder}
              disabled={isAddingNew}
              className="p-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors flex items-center gap-1 text-sm font-medium"
            >
              <PlusIcon className="size-4" />
              <span>Nueva Carpeta</span>
            </button>
          </>
        )}
      </div>
      {showLimitError && (
        <p className="text-red-500 text-xs font-semibold">
          Has alcanzado el límite de 100 carpetas
        </p>
      )}
    </div>
  );
};
