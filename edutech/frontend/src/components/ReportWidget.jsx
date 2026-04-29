import React, { useState } from 'react';
import { CheckIcon, XMarkIcon, ChevronDownIcon, ChevronUpIcon, TrashIcon } from '@heroicons/react/24/outline';
import { ReportReason } from './ReportReason';
import { LABELS } from './PostCard';

export const ReportWidget = ({ report, onAccept, onReject }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const { title, subject, type, reasons } = report;

  const SelectedLabel = LABELS[type] || LABELS.VID;

  return (
    <div className="mb-4 bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden transition-all duration-200">
      <div 
        onClick={() => setIsOpen(!isOpen)}
        className="p-4 flex items-center justify-between cursor-pointer hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center min-w-0 gap-4">
          <div className="text-gray-400 shrink-0">
            {isOpen ? <ChevronUpIcon className="w-5 h-5 stroke-2" /> : <ChevronDownIcon className="w-5 h-5 stroke-2" />}
          </div>
          <div className="shrink-0 scale-90">
            <SelectedLabel />
          </div>
          <div className="overflow-hidden">
            <h3 className="font-bold text-gray-900 text-lg uppercase tracking-tighter leading-tight line-clamp-2 break-words">
              {title}
            </h3>
            <p className="text-xs text-gray-500 italic mt-1 uppercase tracking-wider">{subject}</p>
          </div>
        </div>

        <div className="flex items-center shrink-0 gap-2">
          {!showConfirm ? (
            <>
              <button 
                onClick={(e) => { e.stopPropagation(); onAccept(); }}
                className="p-2 rounded-full hover:bg-green-100 text-green-600 transition-colors"
                title="Aceptar reporte"
              >
                <CheckIcon className="w-6 h-6 stroke-2" />
              </button>
              <button 
                onClick={(e) => { e.stopPropagation(); setShowConfirm(true); }}
                className="p-2 rounded-full hover:bg-red-50 text-red-400 hover:text-red-600 transition-colors"
                title="Rechazar"
              >
                <XMarkIcon className="w-6 h-6 stroke-2" />
              </button>
            </>
          ) : (
            <div className="flex items-center gap-1 bg-red-50 rounded-full px-2 py-1 border border-red-100 animate-in fade-in zoom-in duration-200">
              <span className="text-[10px] font-bold text-red-600 px-1 uppercase">¿Eliminar?</span>
              <button 
                onClick={(e) => { e.stopPropagation(); onReject(); }}
                className="p-1.5 bg-red-600 text-white rounded-full hover:bg-red-700"
              >
                <TrashIcon className="w-4 h-4" />
              </button>
              <button 
                onClick={(e) => { e.stopPropagation(); setShowConfirm(false); }}
                className="p-1.5 text-gray-400 hover:text-gray-600"
              >
                <XMarkIcon className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>

      {isOpen && (
        <div className="border-t border-gray-100 bg-gray-50/30">
          <div className="bg-gray-100/50 px-4 py-2 text-[10px] font-black text-gray-400 uppercase tracking-widest">
            Historial de reportes ({reasons.length})
          </div>
          <div className="max-h-80 overflow-y-auto">
            {reasons.map((r, index) => (
              <ReportReason key={index} {...r} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};