import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ChevronLeftIcon, PhoneXMarkIcon } from "@heroicons/react/24/outline";
import { useCurrentUser } from "../services/useCurrentUser";
import { connectToSessionChat, sendTwitchMessage, stopStream } from "../services/connections-streaming"; 
import { getStudySession } from "../services/connections-studysessions"; 
import type { TwitchChatMessage } from "../models/studysessions/twitch.model";
import type { StudySession } from "../models/studysessions/studysession.model";

const SessionLive = () => {
  const { sessionId } = useParams<{ sessionId: string }>();
  const navigate = useNavigate();
  const { userData: currentUser } = useCurrentUser();
  
  const [session, setSession] = useState<StudySession | null>(null);
  const [messages, setMessages] = useState<TwitchChatMessage[]>([]);
  const [chatInput, setChatInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }), [messages]);

  useEffect(() => {
    if (!sessionId || !currentUser?.id) return;

    getStudySession(Number(sessionId), currentUser.id)
      .then(setSession)
      .catch(console.error);

    const socket = connectToSessionChat(Number(sessionId), (newMessage) => {
      setMessages((prev) => [...prev, newMessage]);
    });

    return () => socket.close();
  }, [sessionId, currentUser?.id]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim() || !currentUser?.id || !sessionId) return;
    try {
      await sendTwitchMessage(Number(sessionId), currentUser.id, chatInput);
      setChatInput("");
    } catch (error) {
      console.error("Error al enviar mensaje:", error);
    }
  };

  const handleStopStream = async () => {
    if (!sessionId) return;
    try {
      await stopStream(Number(sessionId));
      navigate(-1);
    } catch (error) {
      console.error("Error al detener el stream:", error);
    }
  };

  const parentDomain = window.location.hostname;
  const channelLogin = session?.twitch_link
    ? session.twitch_link.replace(/\/$/, '').split('/').pop()
    : null;
  const twitchStreamUrl = channelLogin
    ? `https://player.twitch.tv/?channel=${channelLogin}&parent=${parentDomain}&autoplay=true&muted=true`
    : null;

  return (
    <div className="min-h-screen w-full bg-gray-900 p-6 flex flex-col font-sans">
      <div className="mb-4">
        <button 
          onClick={() => navigate(-1)} 
          className="flex items-center gap-2 text-white hover:text-gray-300 font-bold transition-colors"
        >
          <ChevronLeftIcon className="w-5 h-5" />
          VOLVER
        </button>
      </div>

      {/* Grid principal: Stream (izquierda) y Chat (derecha) */}
      <div className="flex-1 grid gap-6 lg:grid-cols-[7.5fr_2.5fr] mb-6 min-h-0">
        
        {/* Lado Izquierdo: Reproductor de Video */}
        <div className="relative rounded-[32px] overflow-hidden bg-black shadow-2xl border border-gray-800">
          {twitchStreamUrl ? (
            <iframe
              src={twitchStreamUrl}
              height="100%"
              width="100%"
              frameBorder="0"
              allow="autoplay"
              allowFullScreen
              title="Streaming en directo"
              className="w-full h-full"
            />
          ) : (
            <div className="h-full flex items-center justify-center text-gray-500 italic">
              Conectando con la sesión...
            </div>
          )}
          
          {/* Botón flotante para detener el stream */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
             <button 
                onClick={handleStopStream}
                className="p-5 bg-red-600 hover:bg-red-700 rounded-full shadow-2xl text-white transition-all hover:scale-110 active:scale-95 border-4 border-black/20"
                title="Finalizar transmisión"
              >
                <PhoneXMarkIcon className="w-8 h-8" />
             </button>
          </div>
        </div>

        {/* Lado Derecho: Chat de la Sesión */}
        <div className="flex flex-col bg-white rounded-[32px] shadow-xl overflow-hidden border border-gray-100 h-full max-h-[85vh]">
          {/* Cabecera del Chat */}
          <div className="p-5 bg-white border-b border-gray-100">
            <h2 className="font-bold text-gray-900 uppercase tracking-widest text-xs text-center">
              Chat en Vivo
            </h2>
          </div>
          
          {/* Lista de Mensajes */}
          <div className="flex-1 p-5 overflow-y-auto bg-gray-50/50 space-y-4">
            {messages.map((msg) => (
              <div key={msg.message_id} className="text-sm animate-in fade-in slide-in-from-bottom-1 duration-300">
                <span 
                  className="font-bold" 
                  style={{ color: msg.color || '#6366f1' }}
                >
                  {msg.chatter}: 
                </span>
                <span className="ml-2 text-gray-700 leading-relaxed break-words">
                  {msg.text}
                </span>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Formulario de envío */}
          <form onSubmit={handleSendMessage} className="p-4 bg-white border-t border-gray-100">
            <div className="flex gap-2">
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder="Escribe un mensaje..."
                className="flex-1 px-4 py-3 bg-gray-100 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-sm text-gray-800"
              />
              <button 
                type="submit" 
                disabled={!chatInput.trim()}
                className="px-5 py-3 bg-indigo-600 text-white font-bold rounded-2xl hover:bg-indigo-700 active:scale-95 transition-all disabled:opacity-50 disabled:scale-100"
              >
                ENVIAR
              </button>
            </div>
          </form>
        </div>

      </div>
    </div>
  );
};

export default SessionLive;