import { CheckIcon } from '@heroicons/react/24/solid';

interface SelectionIndicatorProps {
  isSelecting?: boolean;
  isSelected?: boolean;
}

export function SelectionIndicator({ isSelecting, isSelected }: SelectionIndicatorProps) {
  if (!isSelecting) return null;
  return (
    <div className={`absolute top-2 left-2 size-5 rounded-full border-2 flex items-center justify-center transition-colors ${isSelected ? 'bg-blue-500 border-blue-500' : 'bg-white border-gray-300'}`}>
      {isSelected && <CheckIcon className="size-3 text-white" />}
    </div>
  );
}
