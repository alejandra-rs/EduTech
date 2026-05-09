import { useState } from 'react';
import { FlagIcon } from '@heroicons/react/24/solid';
import ReportPopup from './ReportPopup';
import { useCurrentUser } from '@services/useCurrentUser';
import { createReport } from '@services/interactions/connections-reports';

export default function ReportButton({ entity = "Publicación", postId, onSubmit }) {
  const { userData } = useCurrentUser();
  const [isOpen, setIsOpen] = useState(false);
  const [animate, setAnimate] = useState(false);
  const [isReported, setIsReported] = useState(false);

  const handleOpen = () => {
    setAnimate(true);
    setTimeout(() => setAnimate(false), 200);
    setIsOpen(true);
  };

  const handleClose = () => setIsOpen(false);

  return (
    <>
      <div className="flex items-center gap-2 select-none group">
        <button
          onClick={handleOpen}
          title={`Reportar ${entity}`}
          className={`
            transition-all duration-200
            ${animate ? 'scale-125' : 'scale-100'}
            ${isReported ? 'text-red-600' : 'text-gray-400 hover:text-red-500'}
            p-1.5 rounded-full hover:bg-red-50
          `}
        >
          <FlagIcon className="w-7 h-7" />
        </button>
      </div>

      <ReportPopup
        isOpen={isOpen}
        onClose={handleClose}
        entity={entity}
        onSubmit={onSubmit}
      />
    </>
  );
}
