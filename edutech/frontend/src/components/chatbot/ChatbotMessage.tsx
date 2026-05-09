import ReactMarkdown from 'react-markdown';
import type { ChatMessage } from '../../models/ia/chat.models';

export interface ChatBotMessageProps {
  msg: ChatMessage;
}

export function ChatBotMessage({ msg }: ChatBotMessageProps) {
  return (
    <div className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
      <div className={`max-w-[80%] p-3 rounded-lg shadow-sm ${
        msg.role === 'user' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 border border-gray-200'
      }`}>

        {msg.role === 'user' ? (
          <p className="whitespace-pre-wrap">{msg.content}</p>
        ) : (
          <div className="prose prose-sm max-w-none prose-p:my-1 prose-ul:my-1 prose-li:my-0 text-gray-700 overflow-x-auto w-full">
            <ReactMarkdown>{msg.content}</ReactMarkdown>
          </div>
        )}

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
  );
}
