import { useState } from 'react';
import { 
  ChevronDownIcon, 
  ChevronUpIcon, 
  ArrowTopRightOnSquareIcon 
} from '@heroicons/react/24/outline';
import { LABELS } from '../post-preview/labels';
import type { PostType } from '../../models/documents/post.model';

interface AdminAction {
  label: string;
  confirmLabel?: string;
  icon: React.ElementType;
  onClick: () => void;
  variant: 'danger' | 'success' | 'secondary';
}

interface AdminWidgetProps {
  title: string;
  subtitle: string;
  type: PostType;
  url?: string | null;
  actions: AdminAction[];
  children?: React.ReactNode;
  collapsible?: boolean;
}

export const AdminWidget = ({ 
  title, 
  subtitle, 
  type, 
  url, 
  actions, 
  children, 
  collapsible = false 
}: AdminWidgetProps) => {
  const [isOpen, setIsOpen] = useState(!collapsible);
  const [confirmingIdx, setConfirmingIdx] = useState<number | null>(null);

  const SelectedLabel = LABELS[type] || LABELS.PDF;

  return (
    <div className="mb-4 bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden w-full transition-all hover:border-blue-100">
      <div 
        className={`p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 ${collapsible ? 'cursor-pointer hover:bg-gray-50' : ''}`}
        onClick={() => collapsible && setIsOpen(!isOpen)}
      >
        <div className="flex items-start gap-4 flex-1 min-w-0">
          {collapsible && (
            <div className="text-gray-400 shrink-0 mt-1">
              {isOpen ? <ChevronUpIcon className="w-5 h-5" /> : <ChevronDownIcon className="w-5 h-5" />}
            </div>
          )}
          
          <div className="shrink-0 mt-1 scale-90 md:scale-100">
            <SelectedLabel />
          </div>
          
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-gray-900 text-base md:text-lg leading-tight truncate">
              {title}
            </h3>
            <p className="text-[10px] md:text-xs text-blue-600 font-semibold uppercase tracking-wider">
              {subtitle}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0 w-full md:w-auto justify-end pt-2 md:pt-0 border-t md:border-t-0">
          {url && (
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg flex items-center gap-2 transition-colors"
            >
              <ArrowTopRightOnSquareIcon className="w-5 h-5" />
              <span className="text-xs font-bold">Ver</span>
            </a>
          )}

          {actions.map((action, idx) => {
            const isConfirming = confirmingIdx === idx;
            const Icon = action.icon;

            if (isConfirming) {
              return (
                <div key={idx} className="flex items-center gap-1 bg-gray-50 border rounded-lg p-1 animate-in slide-in-from-right-1" onClick={e => e.stopPropagation()}>
                  <span className="text-xs font-bold px-2 text-gray-500 italic">{action.confirmLabel || '¿Seguro?'}</span>
                  <button
                    onClick={(e) => { e.stopPropagation(); action.onClick(); }}
                    className="px-3 py-1 bg-green-600 text-white text-xs font-bold rounded-md"
                  > SÍ </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); setConfirmingIdx(null); }}
                    className="px-3 py-1 text-gray-500 text-xs font-bold"
                  > NO </button>
                </div>
              );
            }

            const variantClasses = {
              danger: "bg-red-50 text-red-600 hover:bg-red-100",
              success: "bg-green-50 text-green-700 hover:bg-green-100",
              secondary: "text-gray-500 hover:bg-gray-100"
            };

            return (
              <button
                key={idx}
                onClick={(e) => {
                  e.stopPropagation();
                  action.confirmLabel ? setConfirmingIdx(idx) : action.onClick();
                }}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${variantClasses[action.variant]}`}
              >
                <Icon className="w-5 h-5" />
                <span className="text-xs font-bold">{action.label}</span>
              </button>
            );
          })}
        </div>
      </div>
  
      {isOpen && children && (
        <div className="border-t border-gray-100 bg-gray-50/30 p-4">
          {children}
        </div>
      )}
    </div>
  );
};