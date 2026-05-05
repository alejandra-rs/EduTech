import React from 'react';

const Tabs = ({ activeTabs, onTabChange }) => {
  const tabs = [
    { id: 'pdf', label: 'PDF' },
    { id: 'video', label: 'Video' },
    { id: 'cuestionario', label: 'Cuestionario' },
    { id: 'flashcard', label: 'Flashcards' },
  ];

  const handleToggle = (tabId) => {
    if (activeTabs.includes(tabId)) {
      onTabChange(activeTabs.filter(id => id !== tabId));
    } else {
      onTabChange([...activeTabs, tabId]);
    }
    console.log(activeTabs);
  };

  return (
    <ul className="flex flex-wrap justify-center text-sm font-medium text-center gap-2 mb-8">
      {tabs.map((tab) => (
        <li key={tab.id}>
          <button
            onClick={() => handleToggle(tab.id)}
            className={`inline-block px-6 py-2.5 rounded-full transition-all duration-200 shadow-sm
              ${activeTabs.includes(tab.id) 
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