import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import AgoraRTC, {
  AgoraRTCProvider,
  useJoin,
  useRemoteUsers,
  RemoteUser,
} from "agora-rtc-react";
import { MessageSquare, Send, LogOut } from 'lucide-react';
import Peer from 'peerjs';

const client = AgoraRTC.createClient({ mode: "rtc", codec: "vp8" });

const StreamViewerAgora = () => {
  const [appId] = useState("1ba164e2b80d42979295ef4167f61da1");
  const [channel] = useState("sala-pruebas");

  return (
    <AgoraRTCProvider client={client}>
      <div className="h-screen w-full bg-slate-950 flex items-center justify-center text-white">
        <ViewerCanvas appId={appId} channel={channel} />
      </div>
    </AgoraRTCProvider>
  );
};

const ViewerCanvas = ({ appId, channel }) => {
  const navigate = useNavigate();
  const [active, setActive] = useState(true);

  useJoin({ appid: appId, channel: channel, token: null }, active);
  const remoteUsers = useRemoteUsers();

  const [messages, setMessages] = useState([]);
  const [messageInput, setMessageInput] = useState("");
  const [connectedToChat, setConnectedToChat] = useState(false);
  const connRef = useRef(null);

  const handleLeave = () => {
    setActive(false);
    if (connRef.current) connRef.current.close();
    navigate('/');
  };

  useEffect(() => {
    const peer = new Peer();
    let reconnectInterval;

    const connectToHost = () => {
      console.log("Intentando conectar al chat del Host...");
      const conn = peer.connect(`${channel}-chat-host`);
      connRef.current = conn;

      conn.on('open', () => {
        console.log("¡Conexión de chat establecida!");
        setConnectedToChat(true);
        clearInterval(reconnectInterval);
        setMessages((prev) => [...prev, { sender: "Sistema", text: "Conectado al chat del Host", time: "" }]);
      });

      conn.on('data', (data) => {
        setMessages((prev) => [...prev, data]);
      });

      conn.on('close', () => {
        setConnectedToChat(false);
        if (active) {
          reconnectInterval = setInterval(connectToHost, 3000);
        }
      });
    };

    peer.on('open', () => {
      connectToHost();
    });

    return () => {
      clearInterval(reconnectInterval);
      peer.destroy();
    };
  }, [channel, active]);

  const sendMessage = (e) => {
    e.preventDefault();
    if (!messageInput.trim()) return;

    const msgObj = { 
      sender: "Espectador", 
      text: messageInput, 
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) 
    };

    setMessages((prev) => [...prev, msgObj]);

    if (connRef.current && connRef.current.open) {
      connRef.current.send(msgObj);
    }

    setMessageInput("");
  };

  return (
    <div className="h-screen w-full flex flex-col bg-slate-950 text-white font-sans">
      
      <div className="p-4 bg-slate-900/50 backdrop-blur-md flex justify-between items-center border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="bg-green-500 h-3 w-3 rounded-full animate-pulse" />
          <div>
            <h1 className="font-bold text-lg tracking-wide">CLASE EN VIVO</h1>
            <p className="text-xs text-slate-400">Canal activo: <span className="text-blue-400">{channel}</span></p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <span className={`text-xs px-3 py-1.5 rounded-full border ${connectedToChat ? 'bg-green-500/10 border-green-500 text-green-400' : 'bg-yellow-500/10 border-yellow-500 text-yellow-400'}`}>
            {connectedToChat ? "Chat sincronizado" : "Conectando al chat..."}
          </span>
          <button 
            onClick={handleLeave}
            className="flex items-center gap-2 bg-red-600/20 hover:bg-red-600 border border-red-500/50 p-2.5 rounded-xl text-red-400 hover:text-white transition-all duration-300"
            title="Salir de la clase"
          >
            <LogOut size={18} />
            <span className="text-xs font-semibold hidden sm:inline">Salir de la clase</span>
          </button>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">

        <div className="flex-1 flex flex-col justify-center items-center p-6 bg-slate-950">
          {active && remoteUsers.length > 0 ? (
            remoteUsers.map((user) => (
              <div key={user.uid} className="w-full max-w-4xl aspect-video bg-black rounded-3xl overflow-hidden shadow-2xl border border-white/5">
                <RemoteUser user={user} playVideo={true} playAudio={true} className="w-full h-full object-cover" />
              </div>
            ))
          ) : (
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
              <p className="text-slate-400 font-medium">Esperando a que el Host inicie la transmisión...</p>
            </div>
          )}
        </div>

        <div className="w-96 bg-slate-900/40 border-l border-white/10 flex flex-col h-full">
          <div className="p-4 bg-slate-900/60 border-b border-white/5 flex items-center gap-2">
            <MessageSquare size={18} className="text-blue-400" />
            <h2 className="font-semibold text-sm">Chat en directo</h2>
          </div>

          <div className="flex-1 p-4 overflow-y-auto flex flex-col gap-3">
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex flex-col p-3 rounded-xl max-w-[85%] ${msg.sender === "Espectador" ? 'bg-blue-600/20 border border-blue-500/30 self-end' : 'bg-slate-800 border border-slate-700 self-start'}`}>
                <div className="flex items-baseline gap-2 mb-1">
                  <span className={`text-xs font-bold ${msg.sender === "Espectador" ? 'text-blue-300' : 'text-slate-300'}`}>{msg.sender}</span>
                  <span className="text-[10px] text-slate-500">{msg.time}</span>
                </div>
                <p className="text-sm text-slate-200 break-words">{msg.text}</p>
              </div>
            ))}
          </div>

          <form onSubmit={sendMessage} className="p-4 bg-slate-900/60 border-t border-white/5 flex gap-2">
            <input
              type="text"
              disabled={!connectedToChat}
              value={messageInput}
              onChange={(e) => setMessageInput(e.target.value)}
              placeholder={connectedToChat ? "Haz una pregunta..." : "Conectando al chat..."}
              className="flex-1 bg-slate-800 text-sm px-4 py-2.5 rounded-xl border border-slate-700 focus:outline-none focus:border-blue-500 text-slate-100 disabled:opacity-50"
            />
            <button type="submit" disabled={!connectedToChat} className="p-3 bg-blue-600 hover:bg-blue-500 rounded-xl transition-colors text-white disabled:opacity-50">
              <Send size={18} />
            </button>
          </form>
        </div>

      </div>
    </div>
  );
};

export default StreamViewerAgora;