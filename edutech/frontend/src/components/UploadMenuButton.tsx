import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { 
  PlusCircleIcon, 
  DocumentTextIcon, 
  PlayCircleIcon, 
  ClipboardDocumentListIcon, 
  Square3Stack3DIcon 
} from "@heroicons/react/24/outline";

interface UploadMenuButtonProps {
  id: string | undefined;
  subjectId: string | undefined;
}

const UPLOAD_OPTIONS = [
  { label: "PDF", path: "PDF", icon: DocumentTextIcon },
  { label: "Video", path: "Video", icon: PlayCircleIcon },
  { label: "Cuestionario", path: "quiz", icon: ClipboardDocumentListIcon },
  { label: "Flashcards", path: "flashcard", icon: Square3Stack3DIcon },
];

export const UploadMenuButton = ({ id, subjectId }: UploadMenuButtonProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="text-gray-700 hover:text-blue-600 transition-all flex items-center"
      >
        <PlusCircleIcon className="w-10 h-10" />
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-48 bg-white border border-gray-200 rounded-xl shadow-lg z-50 py-2 overflow-hidden">
          {UPLOAD_OPTIONS.map(({ label, path, icon: Icon }) => (
            <Link
              key={path}
              to={`/${id}/${subjectId}/upload/${path}`}
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <Icon className="w-4 h-4 text-gray-400" />
              {label}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};
