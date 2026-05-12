import { useState } from 'react';
import { ChevronDownIcon, PuzzlePieceIcon } from '@heroicons/react/24/solid';
import type { ChatModeOption, ChatMode } from '../../models/ia/agent.models';

export interface ChatbotHeaderProps {
  lista: ChatModeOption<ChatMode>[];
  seleccionado: ChatModeOption<ChatMode>;
  onCambiar: (agente: ChatModeOption<ChatMode>) => void;
  onClose: () => void;
  isDeepThinking: boolean;
  setIsDeepThinking: (value: boolean) => void;
  isToolsMode: boolean;
  setIsToolsMode: (value: boolean) => void;
  toolType: 'quiz' | 'flashcard';
  setToolType: (value: 'quiz' | 'flashcard') => void;
}

export function ChatbotHeader({lista, seleccionado, onCambiar, onClose, isDeepThinking, setIsDeepThinking, isToolsMode, setIsToolsMode, toolType, setToolType}: ChatbotHeaderProps) {
  const [menuAbierto, setMenuAbierto] = useState(false);

  return (
<div className="bg-[#130032] text-sm text-white p-4 flex justify-between items-center relative z-50">

      <div className="flex items-center space-x-3">
        
        {!isToolsMode ? (
          <div className="relative">
            <button
              onClick={() => setMenuAbierto(!menuAbierto)}
              className="font-semibold flex items-center hover:text-blue-300 transition-colors focus:outline-none"
            >
              {seleccionado.label}
              <ChevronDownIcon className={`w-4 h-4 ml-1 transition-transform ${menuAbierto ? 'rotate-180' : ''}`} />
            </button>

            {menuAbierto && (
              <div className="absolute top-full left-0 mt-2 w-56 bg-white rounded-lg shadow-xl py-2 border border-gray-100 text-gray-800">
                {lista.map((agente) => (
                  <button
                    key={agente.key}
                    onClick={() => { onCambiar(agente); setMenuAbierto(false); }}
                    className={`w-full text-left px-4 py-2 text-sm hover:bg-blue-50 transition-colors ${
                      seleccionado.key === agente.key ? 'bg-blue-50 text-blue-700 font-semibold' : ''
                    }`}
                  >
                    {agente.label}
                  </button>
                ))}
              </div>
            )}
            <button
                onClick={() => setIsDeepThinking(!isDeepThinking)}
                title="Activar Pensamiento Profundo"
                className={`p-1.5 rounded-full text-lg transition-all duration-300 shadow-sm ${
                  isDeepThinking
                    ? 'bg-purple-500/30 scale-110 drop-shadow-[0_0_8px_rgba(168,85,247,0.8)]'
                    : 'grayscale opacity-50 hover:grayscale-0 hover:opacity-100'
                }`}
              >🧠
            </button>
          </div>
        ) : (

          <div className="flex bg-white/10 rounded-lg p-1 text-xs font-semibold shadow-inner">
            <button
              onClick={() => setToolType('quiz')}
              className={`px-3 py-1.5 rounded-md transition-colors ${
                toolType === 'quiz' ? 'bg-blue-600 text-white shadow-sm' : 'text-gray-300 hover:text-white'
              }`}
            >
              Quiz
            </button>
            <button
              onClick={() => setToolType('flashcard')}
              className={`px-3 py-1.5 rounded-md transition-colors ${
                toolType === 'flashcard' ? 'bg-blue-600 text-white shadow-sm' : 'text-gray-300 hover:text-white'
              }`}
            >
              Flashcard
            </button>
          </div>
        )}

        
      </div>

      <div className="flex items-center space-x-2">
        <button
          onClick={() => setIsToolsMode(!isToolsMode)}
          title="Modo Generador"
          className={`p-1.5 rounded-md transition-colors ${
            isToolsMode ? 'bg-blue-500/30 text-blue-300' : 'text-gray-400 hover:text-white'
          }`}
        >
          <PuzzlePieceIcon className="w-5 h-5" />
        </button>
        <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors ml-2">✕</button>
      </div>
    </div>
  );
}
