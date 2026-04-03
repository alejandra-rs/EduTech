import React from 'react';

const Tabs = ({ activeTab, onTabChange }) => {
  const tabs = [
    { id: 'pdf', label: 'PDF' },
    { id: 'video', label: 'Video' },
    { id: 'cuestionario', label: 'Cuestionario' },
    { id: 'flashcard', label: 'Flashcard' },
  ];

  return (
    <ul className="flex flex-wrap justify-center text-sm font-medium text-center gap-2 mb-8">
      {tabs.map((tab) => (
        <li key={tab.id}>
          <button
            onClick={() => onTabChange(tab.id)}
            className={`inline-block px-6 py-2.5 rounded-full transition-all duration-200 shadow-sm
              ${activeTab === tab.id 
                ? 'bg-blue-600 text-white shadow-md scale-105' 
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-gray-900'
              }`}
          >
            {tab.label}
          </button>
        </li>
      ))}
    </ul>
  );
};

export default Tabs;