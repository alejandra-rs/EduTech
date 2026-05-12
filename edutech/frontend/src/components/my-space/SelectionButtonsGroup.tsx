import { PlusIcon, TrashIcon, XMarkIcon } from '@heroicons/react/24/outline';

interface SelectionButtonsGroupProps {
  isSelecting: boolean;
  selectedCount: number;
  isAddingNew: boolean;
  onCancelSelection: () => void;
  onDelete: () => void;
  onSelectMode: () => void;
  onAddNewFolder: () => void;
}

export const SelectionButtonsGroup = ({
  isSelecting,
  selectedCount,
  isAddingNew,
  onCancelSelection,
  onDelete,
  onSelectMode,
  onAddNewFolder,
}: SelectionButtonsGroupProps) => {
  return (
    <div className="flex items-center gap-2">
      {isSelecting ? (
        <>
          <button
            onClick={onCancelSelection}
            className="p-1.5 text-gray-500 hover:text-gray-700 rounded-lg transition-colors flex items-center gap-1 text-sm"
          >
            <XMarkIcon className="w-4 h-4" />
            Cancelar
          </button>
          {selectedCount > 0 && (
            <button
              onClick={onDelete}
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
            onClick={onSelectMode}
            className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-100 rounded-lg transition-colors text-sm"
          >
            Eliminar ítems...
          </button>
          <button
            onClick={onAddNewFolder}
            disabled={isAddingNew}
            className="p-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors flex items-center gap-1 text-sm font-medium"
          >
            <PlusIcon className="w-4 h-4" />
            <span>Nueva Carpeta</span>
          </button>
        </>
      )}
    </div>
  );
};
