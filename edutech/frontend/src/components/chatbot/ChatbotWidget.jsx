import React, { useState, useEffect, useRef } from 'react';
import { ChatBubbleLeftEllipsisIcon } from '@heroicons/react/24/solid';
import { askChatbot } from "@services/connections-ia.ts";

import { ChatbotHeader } from './ChatbotHeader.jsx'; 
import { ChatbotMessageBox } from './ChatbotMessageBox.jsx';
import { ChatBotFooterInput } from './ChatbotFooterIntput.jsx';


const AGENTES = [
  { id: 'estricto', label: 'Asistente Estricto' },
  { id: 'tutor', label: 'Tutor' },
  { id: 'ejercicios', label: 'Ejercicios' },
  { id: 'esquemas', label: 'Esquemas' },
];

export function ChatbotWidget({ courseId }) {
  
  const [isOpen, setIsOpen] = useState(false);
  const [agenteActivo, setAgenteActivo] = useState(AGENTES[0]);
  const [isDeepThinking, setIsDeepThinking] = useState(false)
  const [messages, setMessages] = useState([
    { role: 'ai', content: '¡Hola! 👋 Soy tu asistente. ¿En qué puedo ayudarte hoy?' }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const handleSendMessage = async (userQuestion) => {
    setMessages(prev => [...prev, { role: 'user', content: userQuestion }]);
    setIsLoading(true);

    try {
      const data = await askChatbot(userQuestion, courseId, agenteActivo.id, isDeepThinking);
      
      setMessages(prev => [...prev, { 
        role: 'ai', 
        content: data.respuesta_markdown || data.respuesta,
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
        <div className="w-96 sm:w-[450px] bg-white rounded-xl shadow-2xl overflow-hidden flex flex-col h-[600px] border border-gray-200 mb-4 origin-bottom-right transition-all">
          
          <ChatbotHeader 
                  lista={AGENTES} 
                  seleccionado={agenteActivo} 
                  onCambiar={setAgenteActivo}
                  isDeepThinking={isDeepThinking}       
                  setIsDeepThinking={setIsDeepThinking}
                  onClose={() => setIsOpen(false)}
          />  

          <ChatbotMessageBox 
            scrollRef={scrollRef} 
            messages={messages} 
            isLoading={isLoading} 
          />

          <ChatBotFooterInput 
            onSendMessage={handleSendMessage} 
            isLoading={isLoading} 
          />
          
        </div>
      )}

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