import { useState } from 'react';
import { ChevronDownIcon } from '@heroicons/react/24/solid';
import type { ChatModeOption, ChatMode } from '../../models/ia/agent.models';

export interface ChatbotHeaderProps {
  lista: ChatModeOption<ChatMode>[];
  seleccionado: ChatModeOption<ChatMode>;
  onCambiar: (agente: ChatModeOption<ChatMode>) => void;
  onClose: () => void;
  isDeepThinking: boolean;
  setIsDeepThinking: (value: boolean) => void;
}

export function ChatbotHeader({ lista, seleccionado, onCambiar, onClose, isDeepThinking, setIsDeepThinking }: ChatbotHeaderProps) {
  const [menuAbierto, setMenuAbierto] = useState(false);

  return (
    <div className="bg-[#130032] text-sm text-white p-4 flex justify-between items-center relative z-50">

      <div className="flex items-center space-x-3">
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
        </div>

        <button
          onClick={() => setIsDeepThinking(!isDeepThinking)}
          title="Activar Pensamiento Profundo"
          className={`p-1.5 rounded-full text-lg transition-all duration-300 shadow-sm ${
            isDeepThinking
              ? 'bg-purple-500/30 scale-110 drop-shadow-[0_0_8px_rgba(168,85,247,0.8)]'
              : 'grayscale opacity-50 hover:grayscale-0 hover:opacity-100'
          }`}
        >
          🧠
        </button>
      </div>

      <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">✕</button>
    </div>
  );
}
