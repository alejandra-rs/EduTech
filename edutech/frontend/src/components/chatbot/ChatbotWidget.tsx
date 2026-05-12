import { useState, useEffect, useRef } from "react";
import { ChatBubbleLeftEllipsisIcon } from "@heroicons/react/24/solid";
import { askChatbot } from "../../services/connections-ia";
import { ChatbotHeader } from "./ChatbotHeader";
import { ChatbotMessageBox } from "./ChatbotMessageBox";
import { ChatBotFooterInput } from "./ChatbotFooterIntput";
import type { ChatMessage } from "../../models/ia/chat.models";
import { CHAT_MODES } from "../../models/ia/agent.models";
import type { ChatModeOption, ChatMode } from "../../models/ia/agent.models";
import type { DocumentsChat } from "./DocumentMentionList";

export interface ChatbotWidgetProps {
  courseId: number | string;
  documents?: DocumentsChat[];
}

export function ChatbotWidget({
  courseId,
  documents = [],
}: ChatbotWidgetProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [agenteActivo, setAgenteActivo] = useState<ChatModeOption<ChatMode>>(
    CHAT_MODES[0],
  );
  const [isDeepThinking, setIsDeepThinking] = useState(false);

  const [isToolsMode, setIsToolsMode] = useState(false);
  const [toolType, setToolType] = useState<'quiz' | 'flashcard'>('quiz');

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "ai",
      content: "¡Hola! 👋 Soy tu asistente. ¿En qué puedo ayudarte hoy?",
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const handleSendMessage = async (
    userQuestion: string,
    mentionedDocs: { postId: number; title: string }[],
  ) => {
    setMessages((prev) => [...prev, { role: "user", content: userQuestion }]);
     if (isToolsMode) {
      setMessages(prev => [...prev, { 
        role: 'ai', 
        content: '⏳ *Esta operación puede tardar un tiempo en completarse.*' 
      }]);
    }
    setIsLoading(true);
    console.log(mentionedDocs);

    try {
      const data = await askChatbot({
        question: userQuestion,
        course_id: String(courseId),
        mode: isToolsMode ? toolType : agenteActivo.key,
        deep_thinking: isDeepThinking
      });
      setMessages((prev) => [
        ...prev,
        {
          role: "ai",
          content: data.respuesta_markdown ?? data.respuesta,
          fuentes: data.fuentes,
        },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "ai",
          content:
            "Lo siento, ha ocurrido un error al conectar con el servidor.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-8 right-8 z-50 flex flex-col items-end">
      {isOpen && (
        <div className="w-96 sm:w-[450px] bg-white rounded-xl shadow-2xl overflow-hidden flex flex-col h-[600px] border border-gray-200 mb-4 origin-bottom-right transition-all">
          <ChatbotHeader
            lista={CHAT_MODES}
            seleccionado={agenteActivo}
            onCambiar={setAgenteActivo}
            isDeepThinking={isDeepThinking}
            setIsDeepThinking={setIsDeepThinking}

            isToolsMode={isToolsMode}
            setIsToolsMode={setIsToolsMode}
            toolType={toolType}
            setToolType={setToolType}
            
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
            documents={documents}
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
