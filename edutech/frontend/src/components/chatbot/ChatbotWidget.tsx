import { useState, useEffect, useRef } from "react";
import { ChatBubbleLeftEllipsisIcon } from "@heroicons/react/24/solid";
import { askChatbot, generateMaterial } from "../../services/connections-ia";
import { ChatbotHeader } from "./ChatbotHeader";
import { ChatbotMessageBox } from "./ChatbotMessageBox";
import { ChatbotFooterInput } from "./ChatbotFooterInput";
import type { ChatMessage, ChatbotResponse, MaterialResponse } from "../../models/ia/chat.models";
import { CHAT_MODES, MATERIAL_MODES } from "../../models/ia/agent.models";
import type { ChatModeOption, ChatMode, Material } from "../../models/ia/agent.models";
import type { DocumentsChat } from "./DocumentMentionList";

export interface ChatbotWidgetProps {
  courseId: number | string;
  documents?: DocumentsChat[];
  disableMentions?: boolean;
}

const ERROR_MESSAGE: ChatMessage = {
  role: "ai",
  content: "Lo siento, ha ocurrido un error al conectar con el servidor.",
};

function buildChatReply(data: ChatbotResponse): ChatMessage {
  return { role: "ai", content: data.respuesta_markdown ?? data.respuesta, fuentes: data.fuentes };
}

function buildMaterialReply(data: MaterialResponse, materialType: string): ChatMessage {
  if (!data.draft_id) throw new Error("No se devolvió un ID de borrador");
  const draftLink = `/borradores/${materialType}/${data.draft_id}`;
  return { role: "ai", content: `El material ha sido creado como borrador. [**Haz clic aquí para revisarlo y publicarlo**](${draftLink})` };
}

export function ChatbotWidget({ courseId, documents = [], disableMentions = false }: ChatbotWidgetProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [agenteActivo, setAgenteActivo] = useState<ChatModeOption<ChatMode>>(CHAT_MODES[0]);
  const [isDeepThinking, setIsDeepThinking] = useState(false);
  const [isToolsMode, setIsToolsMode] = useState(false);
  const [toolType, setToolType] = useState<ChatModeOption<Material>>(MATERIAL_MODES[0]);
  const [messages, setMessages] = useState<ChatMessage[]>([{ role: "ai", content: "¡Hola! 👋 Soy tu asistente. ¿En qué puedo ayudarte hoy?" }]);
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, isLoading]);

  const appendMessage = (msg: ChatMessage) => setMessages(prev => [...prev, msg]);

  const handleSendMessage = async (userQuestion: string, mentionedDocs: number[]) => {
    appendMessage({ role: "user", content: userQuestion });
    if (isToolsMode) appendMessage({ role: "ai", content: "⏳ *Esta operación puede tardar un tiempo en completarse.*" });
    setIsLoading(true);

    const mentionIds = disableMentions ? documents.map(d => Number(d.id)) : mentionedDocs;

    try {
      const reply = isToolsMode
        ? buildMaterialReply(
            await generateMaterial({ question: userQuestion, course_id: String(courseId), material: toolType.key }),
            toolType.key,
          )
        : buildChatReply(
            await askChatbot({ question: userQuestion, course_id: String(courseId), mode: agenteActivo.key, deep_thinking: isDeepThinking, mentions: mentionIds }),
          );
      appendMessage(reply);
    } catch {
      appendMessage(ERROR_MESSAGE);
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
          <ChatbotMessageBox scrollRef={scrollRef} messages={messages} isLoading={isLoading} />
          <ChatbotFooterInput onSendMessage={handleSendMessage} isLoading={isLoading} documents={documents} disableMentions={disableMentions} />
        </div>
      )}

      {!isOpen && (
        <button type="button"
          onClick={() => setIsOpen(true)}
          className="size-16 bg-[#130032] rounded-full flex items-center justify-center shadow-2xl hover:scale-105 active:scale-95 transition-all duration-200"
        >
          <ChatBubbleLeftEllipsisIcon className="size-8 text-white" />
        </button>
      )}
    </div>
  );
}
