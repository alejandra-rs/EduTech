import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const NotebookFooter = ({ tabs = [] }) => { 
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState(0);

  useEffect(() => {
    if (!tabs || tabs.length === 0) return;

    const currentIndex = tabs.findIndex(tab => 
      location.pathname.endsWith(tab.subPath || tab.path)
    );
    if (currentIndex !== -1) setActiveTab(currentIndex);
  }, [location.pathname, tabs]);

  if (!tabs || tabs.length === 0) return null;

  return (
    <footer className="w-full font-mono pointer-events-none">
      <div className="flex ml-8 space-x-1 items-end h-12 bg-transparent overflow-visible">
        {tabs.map((tab, index) => (
          <button
            key={index}
            onClick={() => {
              setActiveTab(index);
              if (tab.path) {
                navigate(tab.path);
              } else if (tab.subPath) {
                const pathParts = location.pathname.split('/');
                const uploadIndex = pathParts.indexOf('upload');
                if (uploadIndex !== -1) {
                  const newPath = [...pathParts.slice(0, uploadIndex + 1), tab.subPath].join('/');
                  navigate(newPath);
                }
              }
            }}
            className={`
              px-6 transition-all duration-300 ease-out pointer-events-auto
              rounded-t-xl text-white font-bold text-sm uppercase tracking-wider
              ${tab.color}
              ${activeTab === index ? "h-12 pb-3 shadow-lg" : "h-8 pb-1 hover:h-10"}
            `}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div className="bg-white p-8 min-h-[7em] relative shadow-lg pointer-events-auto">
         <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "linear-gradient(#000 1px, transparent 1px)", backgroundSize: "100% 1.5rem" }}></div>
         <div className="absolute left-10 top-0 bottom-0 w-px bg-red-300 opacity-40"></div>
      </div>
    </footer>
  );
};

export default NotebookFooter;