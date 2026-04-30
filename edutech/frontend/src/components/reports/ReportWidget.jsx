import React, { useState } from 'react';
import { CheckIcon, XMarkIcon, ChevronDownIcon, ChevronUpIcon, TrashIcon, ArrowTopRightOnSquareIcon } from '@heroicons/react/24/outline';
import { DocumentReport } from './DocumentReport';
import { LABELS } from '../PostCard';

const TYPE_TO_PATH = { PDF: 'documento', VID: 'video', QUI: 'quiz', FLA: 'flashcard' };

export const ReportWidget = ({ report, onAccept, onReject }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const { postId, title, subject, type, reasons, courseId, yearId } = report;

  const SelectedLabel = LABELS[type] || LABELS.VID;
  const documentPath = TYPE_TO_PATH[type] || 'documento';
  const documentUrl = yearId && courseId ? `/${yearId}/${courseId}/${documentPath}/${postId}` : null;

  return (
    <div className="mb-4 bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden w-full">
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between cursor-pointer hover:bg-gray-50 gap-4"
      >
        <div className="flex items-center gap-3 min-w-0 flex-1 w-full">
          <div className="text-gray-400 shrink-0">
            {isOpen ? <ChevronUpIcon className="w-5 h-5" /> : <ChevronDownIcon className="w-5 h-5" />}
          </div>
          
          <div className="shrink-0 scale-90"> <SelectedLabel /> </div>
          
          <div className="min-w-0 flex-1">
            <h3 className="font-bold text-gray-900 text-sm md:text-base leading-tight break-all"> 
               {title} 
            </h3>
            <p className="text-[10px] text-gray-400 uppercase truncate">{subject}</p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto justify-end border-0">
          {documentUrl && (
            <a
              href={documentUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg flex items-center gap-1"
            >
              <ArrowTopRightOnSquareIcon className="w-5 h-5" />
              <span className="text-xs font-semibold">Ver</span>
            </a>
          )}

          {!showConfirm ? (
            <>
              <button 
                onClick={(e) => { e.stopPropagation(); onAccept(); }} 
                className="flex items-center gap-1 px-3 py-1.5 bg-red-50 text-red-700 rounded-lg hover:bg-red-100 transition-colors"
              >
                <TrashIcon className="w-5 h-5" />
                <span className="text-xs font-semibold">Borrar Contenido</span>
              </button>
              <button 
                onClick={(e) => { e.stopPropagation(); setShowConfirm(true); }} 
                className="flex items-center gap-1 px-3 py-1.5 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <XMarkIcon className="w-5 h-5" />
                <span className="text-xs font-semibold italic">Descartar reportes</span>
              </button>
            </>
          ) : (
            <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-1 animate-in slide-in-from-right-2">
              <span className="text-sm font-semibold px-2 text-gray-500 italic">¿Seguro?</span>
              <button 
                onClick={(e) => { e.stopPropagation(); onReject(); }} 
                className="px-3 py-1 text-green-700 text-sm font-bold hover:rounded-lg hover:bg-green-50"
              >
                SÍ
              </button>
              <button 
                onClick={(e) => { e.stopPropagation(); setShowConfirm(false); }} 
                className="px-3 py-1 text-red-600 text-sm font-bold hover:rounded-lg hover:bg-red-50"
              >
                NO
              </button>
            </div>
          )}
        </div>
      </div>

      {isOpen && (
        <div className="border-t border-gray-100 bg-gray-50/30">
          <div className="max-h-80 overflow-y-auto p-4">
            {reasons.map(r => <DocumentReport key={r.id} {...r} />)}
          </div>
        </div>
      )}
    </div>
  );
};