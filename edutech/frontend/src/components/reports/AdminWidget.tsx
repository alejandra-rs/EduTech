import { useState } from 'react';
import {
  ChevronDownIcon,
  ChevronUpIcon,
  ArrowTopRightOnSquareIcon
} from '@heroicons/react/24/outline';
import { PostLabel } from '../post-preview/labels';
import type { PostType } from '../../models/documents/post.model';
import { ActionButton } from './ActionButton';
import type { AdminAction } from './ActionButton';

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
  title, subtitle, type, url, actions, children, collapsible = false
}: AdminWidgetProps) => {
  const [isOpen, setIsOpen] = useState(!collapsible);
  const [confirmingIdx, setConfirmingIdx] = useState<number | null>(null);

  return (
    <div className="mb-4 bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden w-full transition-all hover:border-blue-100">
      <div
        className={`p-4 flex flex-col md:flex-row items-center justify-between gap-4 ${collapsible ? 'cursor-pointer hover:bg-gray-50' : ''}`}
        onClick={() => collapsible && setIsOpen(!isOpen)}
      >
        <div className="flex items-center gap-4 flex-1 min-w-0">
          {collapsible && (
            <div className="text-gray-400 shrink-0">
              {isOpen ? <ChevronUpIcon className="size-5" /> : <ChevronDownIcon className="size-5" />}
            </div>
          )}
          <div className="shrink-0 scale-90 md:scale-100">
            <PostLabel type={type} />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-gray-900 text-base md:text-lg leading-tight truncate">{title}</h3>
            <p className="text-[10px] md:text-xs text-blue-600 font-semibold tracking-wider">{subtitle}</p>
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
              <ArrowTopRightOnSquareIcon className="size-5" />
              <span className="text-xs font-bold">Ver</span>
            </a>
          )}
          {actions.map((action, idx) => (
            <ActionButton
              key={action.label}
              action={action}
              isConfirming={confirmingIdx === idx}
              onConfirmStart={() => setConfirmingIdx(idx)}
              onConfirmCancel={() => setConfirmingIdx(null)}
            />
          ))}
        </div>
      </div>

      {isOpen && children && (
        <div className="border-t border-gray-100 bg-gray-50/30 p-4">{children}</div>
      )}
    </div>
  );
};
