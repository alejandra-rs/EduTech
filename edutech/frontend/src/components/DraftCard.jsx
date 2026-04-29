import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Square3Stack3DIcon, DocumentCheckIcon, TrashIcon } from '@heroicons/react/24/outline';

const TYPE_LABELS = { QUI: "Cuestionario", FLA: "Flashcards" };

const TypeIcon = ({ type }) =>
  type === "FLA"
    ? <Square3Stack3DIcon className="w-5 h-5 text-indigo-500" />
    : <DocumentCheckIcon className="w-5 h-5 text-orange-500" />;

const itemLabel = (draft) => {
  if (draft.post_type === "FLA") {
    const count = draft.fla?.cards?.length ?? 0;
    return `${count} tarjeta${count !== 1 ? "s" : ""}`;
  }
  if (draft.post_type === "QUI") {
    const count = draft.qui?.questions?.length ?? 0;
    return `${count} pregunta${count !== 1 ? "s" : ""}`;
  }
  return "";
};

export default function DraftCard({ draft, deleting, onDelete }) {
  const navigate = useNavigate();
  const handleOpen = () => navigate(`/borradores/${draft.post_type === "FLA" ? "flashcard" : "quiz"}/${draft.id}`);

  return (
    <div
      onClick={handleOpen}
      className="flex items-center gap-4 bg-white border border-gray-200 rounded-2xl px-5 py-4 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
    >
      <div className="flex-shrink-0">
        <TypeIcon type={draft.post_type} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-gray-800 truncate">
          {draft.title || <span className="text-gray-400 italic">Sin título</span>}
        </p>
        <p className="text-xs text-gray-400 mt-0.5">
          {TYPE_LABELS[draft.post_type]} · {draft.course?.name ?? "Asignatura"} · {itemLabel(draft)}
        </p>
        <p className="text-xs text-gray-300 mt-0.5">
          Actualizado {new Date(draft.updated_at).toLocaleDateString("es-ES", { day: "numeric", month: "short", year: "numeric" })}
        </p>
      </div>
      <button
        onClick={(e) => { e.stopPropagation(); onDelete(); }}
        disabled={deleting}
        className="flex-shrink-0 p-2 rounded-xl hover:bg-red-50 text-gray-300 hover:text-red-400 transition-colors disabled:opacity-40"
        title="Eliminar borrador"
      >
        <TrashIcon className="w-4 h-4" />
      </button>
    </div>
  );
}
