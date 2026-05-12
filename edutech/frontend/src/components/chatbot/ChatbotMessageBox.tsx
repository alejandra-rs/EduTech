import { ArrowPathIcon } from "@heroicons/react/24/outline";
import { ChatBotMessage } from "./ChatbotMessage";
import type { ChatMessage } from "../../models/ia/chat.models";

export interface ChatbotMessageBoxProps {
  scrollRef: React.RefObject<HTMLDivElement | null>;
  messages: ChatMessage[];
  isLoading: boolean;
}

export function ChatbotMessageBox({
  scrollRef,
  messages,
  isLoading,
}: ChatbotMessageBoxProps) {
  return (
    <div
      ref={scrollRef}
      className="flex-1 p-5 overflow-y-auto bg-gray-50 space-y-4 text-sm  break-all overflow-hidden"
    >
      {messages.map((msg, idx) => (
        <ChatBotMessage key={idx} msg={msg} />
      ))}

      {isLoading && (
        <div className="flex justify-start">
          <div className="bg-white border border-gray-200 p-3 rounded-lg shadow-sm">
            <ArrowPathIcon className="w-5 h-5 animate-spin text-blue-600" />
          </div>
        </div>
      )}
    </div>
  );
}
