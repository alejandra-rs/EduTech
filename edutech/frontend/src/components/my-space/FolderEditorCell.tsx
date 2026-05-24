import { FolderIcon } from '@heroicons/react/24/outline';
import { FolderInlineEditor } from './FolderInlineEditor';

interface FolderEditorCellProps {
  existingNames: string[];
  initialValue: string;
  onSave: (name: string) => void;
  onCancel: () => void;
}

export function FolderEditorCell({ existingNames, initialValue, onSave, onCancel }: FolderEditorCellProps) {
  return (
    <div className="flex items-center gap-3 p-4 bg-white border-2 border-dashed border-blue-400 rounded-xl shadow-sm">
      <FolderIcon className="size-8 text-blue-400 shrink-0" />
      <FolderInlineEditor
        existingNames={existingNames}
        initialValue={initialValue}
        onSave={onSave}
        onCancel={onCancel}
      />
    </div>
  );
}
