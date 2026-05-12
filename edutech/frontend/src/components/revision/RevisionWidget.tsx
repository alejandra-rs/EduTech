import { useState } from 'react';
import { 
  TrashIcon, 
  ArrowTopRightOnSquareIcon, 
  CheckIcon, 
  XMarkIcon 
} from '@heroicons/react/24/outline';
import { LABELS } from '../post-preview/labels';

export interface RevisionWidgetProps {
  draft: {
    id: number;
    title: string;
    subject: string;
    description: string;
    url: string;
  };
  onPublish: () => void;
  onDelete: () => void;
}

export const RevisionWidget = ({ draft, onPublish, onDelete }: RevisionWidgetProps) => {
  const [isDescOpen, setIsDescOpen] = useState(false);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [showConfirmPublish, setShowConfirmPublish] = useState(false);

  const { title, subject, description, url } = draft;
  const PDFLabel = LABELS['PDF'];

  return (
    <div className="mb-4 bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden w-full transition-all hover:border-blue-100">
      <div className="p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        
        <div className="flex items-start gap-4 flex-1 min-w-0">
          <div className="shrink-0 mt-1">
             <PDFLabel />
          </div>
          
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-gray-900 text-lg leading-tight truncate">
              {title}
            </h3>
            <p className="text-xs text-blue-600 font-semibold uppercase tracking-wider mb-2">{subject}</p>
            
            <div className="text-sm text-gray-600">
              <p className={`${isDescOpen ? '' : 'line-clamp-1'} break-words`}>
                {description || "Sin descripción proporcionada."}
              </p>
              {description && description.length > 80 && (
                <button 
                  onClick={() => setIsDescOpen(!isDescOpen)}
                  className="text-blue-500 font-bold text-xs mt-1 hover:text-blue-700 transition-colors"
                >
                  {isDescOpen ? 'Ver menos' : 'Ver más...'}
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 shrink-0 w-full md:w-auto justify-end border-t md:border-t-0 pt-4 md:pt-0">
          
          {!showConfirmDelete && !showConfirmPublish && (
            <>
              <a
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg flex items-center gap-2 transition-colors"
                title="Abrir PDF"
              >
                <ArrowTopRightOnSquareIcon className="w-5 h-5 text-blue-500" />
                <span className="text-sm font-bold">Ver</span>
              </a>

              <button
                onClick={() => setShowConfirmPublish(true)}
                className="flex items-center gap-2 px-4 py-2 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-colors"
              >
                <CheckIcon className="w-5 h-5" />
                <span className="text-sm font-bold">Publicar</span>
              </button>

              <button
                onClick={() => setShowConfirmDelete(true)}
                className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
              >
                <TrashIcon className="w-5 h-5" />
                <span className="text-sm font-bold">Eliminar</span>
              </button>
            </>
          )}

          {showConfirmPublish && (
            <div className="flex items-center gap-2 bg-green-50 border border-green-200 rounded-lg p-1 animate-in slide-in-from-right-1">
              <span className="text-sm font-bold px-2 text-green-700">¿Publicar?</span>
              <button
                onClick={onPublish}
                className="px-3 py-1 bg-green-600 text-white text-sm font-bold rounded-md hover:bg-green-700"
              >
                SÍ
              </button>
              <button
                onClick={() => setShowConfirmPublish(false)}
                className="px-3 py-1 text-gray-500 text-sm font-bold hover:bg-white rounded-md"
              >
                NO
              </button>
            </div>
          )}

          {showConfirmDelete && (
            <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-lg p-1 animate-in slide-in-from-right-1">
              <span className="text-sm font-bold px-2 text-red-700">¿Borrar?</span>
              <button
                onClick={onDelete}
                className="px-3 py-1 bg-red-600 text-white text-sm font-bold rounded-md hover:bg-red-700"
              >
                SÍ
              </button>
              <button
                onClick={() => setShowConfirmDelete(false)}
                className="px-3 py-1 text-gray-500 text-sm font-bold hover:bg-white rounded-md"
              >
                NO
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};