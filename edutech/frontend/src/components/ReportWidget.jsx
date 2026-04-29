import React, { useState } from 'react';
import { CheckIcon, XMarkIcon, ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/outline';
import { ReportReason } from './ReportReason';

const TYPE_LABELS = {
  PDF: { label: 'PDF', color: 'bg-red-100 text-red-700 border-red-200' },
  VID: { label: 'VÍDEO', color: 'bg-blue-100 text-blue-700 border-blue-200' },
  QUI: { label: 'QUIZ', color: 'bg-emerald-100 text-emerald-700 border-emerald-200' },
  FLC: { label: 'FLASH', color: 'bg-indigo-100 text-indigo-700 border-indigo-200' },
};

export const ReportWidget = ({ report }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { title, subject, type, reasons } = report;

  const handleAction = (e, action) => {
    e.stopPropagation();
    console.log(`${action} reporte de: ${title}`);
  };

  return (
    <div className="mb-4 bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden transition-all duration-200">
      <div 
        onClick={() => setIsOpen(!isOpen)}
        className="p-4 flex items-center justify-between cursor-pointer hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center gap-4">
          <div className={`px-3 py-1 rounded text-[10px] font-bold border ${TYPE_LABELS[type].color}`}>
            {TYPE_LABELS[type].label}
          </div>
          <div>
            <h3 className="font-bold text-gray-900 text-lg uppercase tracking-tight">{title}</h3>
            <p className="text-sm text-gray-500 italic">{subject}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button 
            onClick={(e) => handleAction(e, 'Aceptar')}
            className="p-2 rounded-full hover:bg-green-100 text-green-600 transition-colors border border-transparent hover:border-green-200"
          >
            <CheckIcon className="w-6 h-6 stroke-2" />
          </button>
          <button 
            onClick={(e) => handleAction(e, 'Rechazar')}
            className="p-2 rounded-full hover:bg-red-100 text-red-600 transition-colors border border-transparent hover:border-red-200"
          >
            <XMarkIcon className="w-6 h-6 stroke-2" />
          </button>
          <div className="ml-2 text-gray-400">
            {isOpen ? <ChevronUpIcon className="w-5 h-5" /> : <ChevronDownIcon className="w-5 h-5" />}
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="border-t border-gray-100">
          <div className="bg-gray-100 px-4 py-2 text-xs font-bold text-gray-500 uppercase tracking-wider">
            Motivos del reporte ({reasons.length})
          </div>
          <div className="max-h-96 overflow-y-auto">
            {reasons.map((r, index) => (
              <ReportReason key={index} {...r} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};