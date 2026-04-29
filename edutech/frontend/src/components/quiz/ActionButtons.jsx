import React from 'react';

export function ActionButtons({ onPublish, canPublish, children }) {
  return (
    <>
      <button
        onClick={onPublish}
        disabled={!canPublish}
        className={`flex items-center justify-center gap-2 w-full py-3 rounded-xl text-sm font-bold transition-all mb-4
              ${canPublish ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-md' : 'bg-gray-200 text-gray-400 cursor-not-allowed'}`}
      >
        {children}
      </button>
      <button className="w-full py-2 mb-4 rounded-xl text-sm font-medium text-gray-500 border border-gray-200 hover:bg-gray-100 transition-all">
        Guardar en borradores
      </button>
    </>
  );
}
