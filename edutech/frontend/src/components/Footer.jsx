import React, { useState } from "react";

const NotebookFooter = ({ tabs }) => {
  const [activeTab, setActiveTab] = useState(0);
  return (
    <footer className="w-full font-mono pointer-events-none">
      <div className="flex ml-8 space-x-1 items-end h-12 bg-transparent overflow-visible">
        {tabs.map((tab, index) => {
          const isActive = activeTab === index;
          return (
            <button
              key={index}
              onClick={() => setActiveTab(index)}
              className={`
                px-6 transition-all duration-300 ease-out pointer-events-auto
                rounded-t-xl text-white font-bold text-sm uppercase tracking-wider
                ${tab.color}
                ${
                  isActive
                    ? "h-12 pb-3 shadow-[0_-4px_10px_rgba(0,0,0,0.1)]"
                    : "h-8 pb-1 hover:h-10"
                }
              `}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      <div
        className="bg-white p-8 min-h-[7em] relative overflow-hidden
       shadow-[0_-1px_10px_rgba(0,0,0,0.05)] pointer-events-auto"
      >
        <div
          className="absolute inset-0 opacity-10 pointer-events-none"
          style={{
            backgroundImage: "linear-gradient(#000 1px, transparent 1px)",
            backgroundSize: "100% 1.5rem",
            backgroundPosition: "0 1.5rem",
          }}
        ></div>

        <div className="absolute left-10 top-0 bottom-0 w-px bg-red-300 opacity-40"></div>
      </div>
    </footer>
  );
};

export default NotebookFooter;
