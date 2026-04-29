import React, { useState, useEffect, useRef } from 'react';
import { PaperAirplaneIcon, ChatBubbleLeftEllipsisIcon, ArrowPathIcon } from '@heroicons/react/24/solid';
import { askChatbot } from "@services/connections.js"; 

export function ChatbotWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [messages, setMessages] = useState([
    { role: 'ai', content: '¡Hola! 👋 Soy tu asistente. ¿En qué puedo ayudarte hoy?' }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef(null);

  // Scroll automático al final cuando llega un mensaje nuevo
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userQuestion = inputValue;
    setMessages(prev => [...prev, { role: 'user', content: userQuestion }]);
    setInputValue("");
    setIsLoading(true);

    try {
      // Aquí enviamos la pregunta. Puedes pasar la asignatura dinámicamente si la tienes
      const data = await askChatbot(userQuestion, "Nombre de la asignatura", "estricto");
      
      setMessages(prev => [...prev, { 
        role: 'ai', 
        content: data.respuesta,
        fuentes: data.fuentes 
      }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'ai', content: "Lo siento, ha ocurrido un error al conectar con el servidor." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-8 right-8 z-50 flex flex-col items-end">
      {isOpen && (
        <div className="w-80 sm:w-96 bg-white rounded-xl shadow-2xl overflow-hidden flex flex-col h-[500px] border border-gray-200 mb-4 origin-bottom-right transition-all">
          
          <div className="bg-[#130032] text-sm text-white p-4 flex justify-between items-center">
            <h3 className="font-semibold">Asistente de documentación</h3>
            <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-white">✕</button>
          </div>

          {/* Cuerpo del chat */}
          <div ref={scrollRef} className="flex-1 p-5 overflow-y-auto bg-gray-50 space-y-4 text-sm">
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] p-3 rounded-lg shadow-sm ${
                  msg.role === 'user' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 border border-gray-200'
                }`}>
                  <p className="whitespace-pre-wrap">{msg.content}</p>
                  
                  {/* Renderizar fuentes si existen */}
                  {msg.fuentes && msg.fuentes.length > 0 && (
                    <div className="mt-2 pt-2 border-t border-gray-100 text-[10px] text-gray-500">
                      <p className="font-bold mb-1">Fuentes usadas:</p>
                      {msg.fuentes.map((f, i) => (
                        <div key={i}>• {f.titulo} (Pág. {f.p})</div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
            
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white border border-gray-200 p-3 rounded-lg shadow-sm">
                  <ArrowPathIcon className="w-5 h-5 animate-spin text-blue-600" />
                </div>
              </div>
            )}
          </div>

          {/* Footer Input */}
          <div className="p-3 border-t border-gray-200 bg-white">
            <div className="relative flex items-center">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Escribe aquí tu consulta"
                className="w-full pl-4 pr-12 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 text-sm"
              />
              <button 
                onClick={handleSendMessage}
                disabled={isLoading}
                className={`absolute right-2 p-2 transition-colors ${isLoading ? 'text-gray-300' : 'text-blue-600 hover:text-blue-800'}`}
              >
                <PaperAirplaneIcon className="w-5 h-5 -rotate-45" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Botón flotante */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="w-16 h-16 bg-[#130032] rounded-full flex items-center justify-center shadow-2xl hover:scale-105 active:scale-95 transition-all duration-200"
        >
          <ChatBubbleLeftEllipsisIcon className="w-8 h-8 text-white" />
        </button>
      )}
    </div>
  );
}