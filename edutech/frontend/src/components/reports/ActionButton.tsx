export interface AdminAction {
  label: string;
  confirmLabel?: string;
  icon: React.ElementType;
  onClick: () => void;
  variant: 'danger' | 'success' | 'secondary';
}

const variantClasses = {
  danger: "bg-red-50 text-red-600 hover:bg-red-100",
  success: "bg-green-50 text-green-700 hover:bg-green-100",
  secondary: "text-gray-500 hover:bg-gray-100",
};

export function ActionButton({ action, isConfirming, onConfirmStart, onConfirmCancel }: {
  action: AdminAction;
  isConfirming: boolean;
  onConfirmStart: () => void;
  onConfirmCancel: () => void;
}) {
  const Icon = action.icon;
  const stop = (e: React.MouseEvent) => e.stopPropagation();

  if (isConfirming) {
    return (
      <div
        className="flex items-center gap-1 bg-gray-50 border rounded-lg p-1 animate-in slide-in-from-right-1"
        onClick={stop}
      >
        <span className="text-xs font-bold px-2 text-gray-500 italic">
          {action.confirmLabel || '¿Seguro?'}
        </span>
        <button type="button"
          onClick={(e) => { stop(e); action.onClick(); }}
          className="px-3 py-1 bg-green-600 text-white text-xs font-bold rounded-md"
        >
          SÍ
        </button>
        <button type="button"
          onClick={(e) => { stop(e); onConfirmCancel(); }}
          className="px-3 py-1 text-gray-500 text-xs font-bold"
        >
          NO
        </button>
      </div>
    );
  }

  return (
    <button type="button"
      onClick={(e) => { stop(e); action.confirmLabel ? onConfirmStart() : action.onClick(); }}
      className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${variantClasses[action.variant]}`}
    >
      <Icon className="size-5" />
      <span className="text-xs font-bold">{action.label}</span>
    </button>
  );
}
