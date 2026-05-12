import { useEffect, useRef, useState } from 'react';

const DURATION_MS = 5000;

interface DeleteUndoToastProps {
  onUndo: () => void;
  onConfirm: () => void;
}

export function DeleteUndoToast({ onUndo, onConfirm }: DeleteUndoToastProps) {
  const [remaining, setRemaining] = useState(DURATION_MS);
  const onConfirmRef = useRef(onConfirm);
  onConfirmRef.current = onConfirm;

  useEffect(() => {
    const start = Date.now();
    const tick = setInterval(() => {
      const left = Math.max(0, DURATION_MS - (Date.now() - start));
      setRemaining(left);
      if (left === 0) {
        clearInterval(tick);
        onConfirmRef.current();
      }
    }, 50);
    return () => clearInterval(tick);
  }, []);

  const seconds = Math.ceil(remaining / 1000);
  const progressPct = (remaining / DURATION_MS) * 100;

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-full max-w-md px-4">
      <div className="bg-gray-900 text-white rounded-2xl shadow-2xl overflow-hidden">
        <div className="flex items-center gap-3 px-5 py-4">
          <span className="text-xs text-gray-400 tabular-nums w-5 text-right">{seconds}s</span>
          <button
            onClick={onUndo}
            className="flex items-center gap-1.5 text-sm font-semibold text-blue-400 hover:text-blue-300 transition-colors ml-2"
          >
           Deshacer
          </button>
        </div>
        <div className="h-1 bg-gray-700">
          <div
            className="h-full bg-blue-500"
            style={{ width: `${progressPct}%`, transition: 'width 50ms linear' }}
          />
        </div>
      </div>
    </div>
  );
}
