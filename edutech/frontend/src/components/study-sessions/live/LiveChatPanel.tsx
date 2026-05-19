import React, { useEffect, useRef, useState } from "react";
import { PaperAirplaneIcon } from "@heroicons/react/24/solid";
import { sendTwitchMessage } from "../../../services/connections-streaming";
import type { TwitchChatMessage } from "../../../models/studysessions/twitch.model";

interface Props {
  sessionId: number;
  currentUserId: number;
  messages: TwitchChatMessage[];
  isTwitchConnected: boolean;
  onConnectTwitch: () => void;
}

function ChatMessageItem({ message }: { message: TwitchChatMessage }) {
  return (
    <div className="text-sm animate-in fade-in slide-in-from-bottom-1 duration-300">
      <span className="font-bold" style={{ color: message.color || "#6366f1" }}>
        {message.chatter}:
      </span>
      <span className="ml-2 text-gray-700 leading-relaxed break-words">{message.text}</span>
    </div>
  );
}

export default function LiveChatPanel({ sessionId, currentUserId, messages, isTwitchConnected, onConnectTwitch }: Props) {
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    if (!isTwitchConnected) {
      onConnectTwitch();
      return;
    }

    try {
      await sendTwitchMessage(sessionId, currentUserId, input);
      setInput("");
    } catch (error) {
      console.error("Error al enviar mensaje:", error);
    }
  };

  return (
    <div className="flex flex-col bg-white rounded-[32px] shadow-xl overflow-hidden border border-gray-100 h-full max-h-[85vh]">
      <div className="p-5 bg-white border-b border-gray-100">
        <h2 className="font-bold text-gray-900 uppercase tracking-widest text-xs text-center">
          Chat en Vivo
        </h2>
      </div>

      <div className="flex-1 p-5 overflow-y-auto bg-gray-50/50 space-y-4">
        {messages.map((msg) => (
          <ChatMessageItem key={msg.message_id} message={msg} />
        ))}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSubmit} className="p-4 bg-white border-t border-gray-100">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={isTwitchConnected ? "Escribe un mensaje..." : "Conéctate a Twitch para chatear..."}
            className="flex-1 px-4 py-3 bg-gray-100 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-sm text-gray-800"
          />
          <button
            type="submit"
            title={isTwitchConnected ? "Enviar mensaje" : "Conectar con Twitch"}
            className="px-4 py-3 bg-indigo-600 text-white font-bold rounded-2xl hover:bg-indigo-700 active:scale-95 transition-all disabled:opacity-50 disabled:scale-100"
            disabled={!input.trim()}
          >
            <PaperAirplaneIcon className="w-5 h-5" />
          </button>
        </div>
      </form>
    </div>
  );
}
