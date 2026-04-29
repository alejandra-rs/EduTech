import React from 'react';
import { ChevronLeftIcon, Bars3BottomLeftIcon } from "@heroicons/react/24/solid";

const label = (item, index) => item.title || item.question || 'Sin título';

const EditorSidebar = ({ items, canPublish, showSidebar, onToggle, onPublish, onScrollTo, itemLabel, requirements, children, defaultLabel }) => {
  const getLabel = itemLabel ?? defaultLabel ?? label;

  return (
    <aside className={`fixed right-0 top-0 h-full bg-gray-50 border-l border-gray-200 transition-all duration-300 z-50 shadow-xl ${showSidebar ? 'w-72' : 'w-0'}`}>
      <button
        onClick={onToggle}
        className="absolute top-10 -left-10 bg-white border border-gray-200 p-2 rounded-l-xl shadow-sm hover:bg-gray-50 transition-all"
      >
        <ChevronLeftIcon className={`w-5 h-5 text-gray-500 transition-transform duration-300 ${showSidebar ? 'rotate-180' : ''}`} />
      </button>

      <div className={`flex flex-col h-full p-5 mt-3 overflow-hidden transition-opacity duration-300 ${showSidebar ? 'opacity-100' : 'opacity-0'}`}>
        <button
          onClick={onPublish}
          disabled={!canPublish}
          className={`flex items-center justify-center gap-2 w-full py-3 rounded-xl text-md font-semibold transition-all mb-4
            ${canPublish ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-md' : 'bg-gray-200 text-gray-400 cursor-not-allowed'}`}
        >
          {children}
        </button>
        <button className="w-full py-2 mb-4 rounded-xl text-sm font-semibold text-gray-500 border border-gray-200 hover:bg-gray-100 transition-all">
          Guardar en borradores
        </button>
        <hr className='border-gray-300 m-3'></hr>

        <nav className="flex-1 overflow-y-auto space-y-2">
          {items.map((item, index) => (
            <button
              key={item.id}
              onClick={() => onScrollTo(item.id)}
              className="flex items-start gap-3 w-full p-3 rounded-lg hover:bg-white hover:shadow-sm text-left transition-all group"
            >
              <Bars3BottomLeftIcon className="w-4 h-4 text-gray-300 mt-0.5 group-hover:text-blue-500" />
              <span className="text-sm text-gray-600 group-hover:text-blue-600 truncate">
                {label(item, index)}
              </span>
            </button>
          ))}
        </nav>

        {!canPublish && requirements?.length > 0 && (
          <div className="p-3 bg-red-50 rounded-lg border border-red-100 mt-4 mb-5">
            <p className="text-[10px] text-red-500 font-bold uppercase mb-1">Requisitos faltantes</p>
            <ul className="text-[10px] text-red-400 list-disc pl-3 space-y-1">
              {requirements.map((req, i) => <li key={i}>{req}</li>)}
            </ul>
          </div>
        )}
      </div>
    </aside>
  );
};

export default EditorSidebar;
