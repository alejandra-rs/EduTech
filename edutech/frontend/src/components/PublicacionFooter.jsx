import React, { useState } from 'react';

const NotebookFooter = () => {
  const [activeTab, setActiveTab] = useState(0);

  const tabs = [
    { label: 'PDF', color: 'bg-red-400' },
    { label: 'Video', color: 'bg-blue-400' },
  ];

  return (
    /* Eliminado: mt-20 */
    <footer className="w-full font-mono shrink-0">
      <div className="flex ml-8 space-x-1 items-end h-12">
        {tabs.map((tab, index) => {
          const isActive = activeTab === index;
          return (
            <button
              key={index}
              onClick={() => setActiveTab(index)}
              className={`
                px-6 transition-all duration-300 ease-out
                rounded-t-xl text-white font-bold text-sm uppercase tracking-wider
                ${tab.color}
                ${isActive 
                  ? 'h-12 pb-3 shadow-[0_-4px_10px_rgba(0,0,0,0.1)]' 
                  : 'h-8 pb-1 hover:h-10'
                }
              `}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      <div className="bg-white shadow-[0_-10px_25px_-5px_rgba(0,0,0,0.1)] p-6 min-h-[100px] relative overflow-hidden">
        <div 
          className="absolute inset-0 opacity-10 pointer-events-none" 
          style={{ 
            backgroundImage: 'linear-gradient(#000 1px, transparent 1px)', 
            backgroundSize: '100% 1.5rem',
            backgroundPosition: '0 1.5rem'
          }}
        ></div>
        <div className="absolute left-10 top-0 bottom-0 w-px bg-red-300 opacity-40"></div>
      </div>
    </footer>
  );
};

export default NotebookFooter;