import React from 'react';
import { useState } from 'react';
import { PaperAirplaneIcon } from "@heroicons/react/24/outline";

export function ChatBotFooterInput({ onSendMessage, isLoading }) {
  const [inputValue, setInputValue] = useState("");

  const handleSend = () => {
    if (!inputValue.trim() || isLoading) return;
    onSendMessage(inputValue);
    setInputValue("");
  };

return (
  <div className="p-3 border-t border-gray-200 bg-white">
      <div className="relative flex items-center">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Escribe aquí tu consulta"
          className="w-full pl-4 pr-12 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 text-sm" />
        <button
          onClick={handleSend}
          disabled={isLoading}
          className={`absolute right-2 p-2 transition-colors ${isLoading ? 'text-gray-300' : 'text-blue-600 hover:text-blue-800'}`}
        >
          <PaperAirplaneIcon className="w-5 h-5 -rotate-45" />
        </button>
      </div>
    </div>
    );
  }
