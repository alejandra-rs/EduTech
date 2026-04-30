import React from 'react';

export function ChatBotMessage({ msg }) {
    return (
    <div className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
      <div className={`max-w-[80%] p-3 rounded-lg shadow-sm ${msg.role === 'user' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 border border-gray-200'}`}>
        <p className="whitespace-pre-wrap">{msg.content}</p>

        {msg.fuentes && msg.fuentes.length > 0 && (
          <div className="mt-2 pt-2 border-t border-gray-100 text-[10px] text-gray-500">
            <p className="font-bold mb-1">Fuentes usadas:</p>
            {msg.fuentes.map((fuente) => (
              <div key={fuente.id}>• {fuente.titulo} (Pág. {fuente.p})</div>
            ))}
          </div>
        )}
      </div>
    </div>
    )
  }
