import React, { useState, useEffect, useRef } from 'react';
import AgoraRTC, {
  AgoraRTCProvider,
  LocalVideoTrack,
  useJoin,
  useLocalCameraTrack,
  useLocalMicrophoneTrack,
  usePublish,
} from "agora-rtc-react";
import { Mic, MicOff, Video, VideoOff, LogOut, Send, MessageSquare } from 'lucide-react';
import Peer from 'peerjs';

const client = AgoraRTC.createClient({ mode: "rtc", codec: "vp8" });

const StreamHostAgora = () => {
  const [appId] = useState("1ba164e2b80d42979295ef4167f61da1"); 
  const [channel] = useState("sala-pruebas");
  const [token] = useState(null); 

  return (
    <AgoraRTCProvider client={client}>
      <HostCanvas appId={appId} channel={channel} token={token} />
    </AgoraRTCProvider>
  );
};

const HostCanvas = ({ appId, channel, token }) => {
  const [active, setActive] = useState(true);
  const [micOn, setMic] = useState(true);
  const [videoOn, setVideo] = useState(true);

  const [messages, setMessages] = useState([]);
  const [messageInput, setMessageInput] = useState("");
  const [connections, setConnections] = useState([]);
  const connectionsRef = useRef([]);

  useJoin({ appid: appId, channel: channel, token: token }, active);
  
  const { localMicrophoneTrack } = useLocalMicrophoneTrack(true);
  const { localCameraTrack } = useLocalCameraTrack(true);
  
  usePublish([localMicrophoneTrack, localCameraTrack]);

  useEffect(() => {
    if (localMicrophoneTrack) {
      localMicrophoneTrack.setEnabled(micOn);
    }
  }, [micOn, localMicrophoneTrack]);

  useEffect(() => {
    if (localCameraTrack) {
      localCameraTrack.setEnabled(videoOn);
    }
  }, [videoOn, localCameraTrack]);

  useEffect(() => {
    const peer = new Peer(`${channel}-chat-host`);

    peer.on('open', () => {
      console.log("Servidor de chat del Host listo en:", peer.id);
    });

    peer.on('connection', (conn) => {
      console.log("Nuevo espectador conectado al chat:", conn.peer);
      
      connectionsRef.current = [...connectionsRef.current, conn];
      setConnections([...connectionsRef.current]);

      conn.on('data', (data) => {
        setMessages((prev) => [...prev, data]);
        connectionsRef.current.forEach(c => {
          if (c.peer !== conn.peer && c.open) c.send(data);
        });
      });

      const removeConn = () => {
        connectionsRef.current = connectionsRef.current.filter(c => c.peer !== conn.peer);
        setConnections([...connectionsRef.current]);
      };

      conn.on('close', removeConn);
      conn.on('error', removeConn);
    });

    return () => {
      peer.destroy();
    };
  }, [channel]);

  const sendMessage = (e) => {
    e.preventDefault();
    if (!messageInput.trim()) return;

    const msgObj = { 
      sender: "Host", 
      text: messageInput, 
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) 
    };

    setMessages((prev) => [...prev, msgObj]);

    connectionsRef.current.forEach((conn) => {
      if (conn.open) {
        conn.send(msgObj);
      }
    });

    setMessageInput("");
  };

  return (
    <div className="h-screen w-full bg-slate-950 flex flex-col text-white font-sans">
      <div className="p-4 bg-slate-900/50 backdrop-blur-md flex justify-between items-center border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="bg-red-500 h-3 w-3 rounded-full animate-pulse" />
          <div>
            <h1 className="font-bold text-lg tracking-wide">TRANSMISIÓN EN VIVO</h1>
            <p className="text-xs text-slate-400">Canal: <span className="text-blue-400">{channel}</span></p>
          </div>
        </div>
        <span className="bg-slate-800 text-xs px-3 py-1.5 rounded-full border border-slate-700">
          Espectadores conectados al chat: {connections.length}
        </span>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Contenedor del Video */}
        <div className="flex-1 flex flex-col justify-between p-6 bg-slate-950 relative">
          <div className="flex-1 flex items-center justify-center">
            <div className="w-full max-w-4xl aspect-video bg-slate-900 rounded-2xl overflow-hidden shadow-2xl border border-white/10 relative">
              {videoOn && localCameraTrack ? (
                <LocalVideoTrack track={localCameraTrack} play className="w-full h-full object-cover" />
              ) : (
                <div className="absolute inset-0 bg-slate-900 flex flex-col items-center justify-center gap-3">
                  <VideoOff size={55} className="text-slate-700" />
                  <p className="text-slate-500 text-sm">La cámara está desactivada</p>
                </div>
              )}
            </div>
          </div>

          <div className="flex justify-center gap-4 py-4">
            <button 
              onClick={() => setMic(!micOn)} 
              className={`p-4 rounded-xl transition-all duration-300 border ${!micOn ? 'bg-red-500/20 border-red-500 text-red-400' : 'bg-slate-800 border-slate-700 text-slate-200'}`}
            >
              {micOn ? <Mic size={22} /> : <MicOff size={22} />}
            </button>
            <button 
              onClick={() => setVideo(!videoOn)} 
              className={`p-4 rounded-xl transition-all duration-300 border ${!videoOn ? 'bg-red-500/20 border-red-500 text-red-400' : 'bg-slate-800 border-slate-700 text-slate-200'}`}
            >
              {videoOn ? <Video size={22} /> : <VideoOff size={22} />}
            </button>
            <button 
              onClick={() => setActive(false)} 
              className="p-4 bg-red-600/20 border border-red-500/50 hover:bg-red-600 rounded-xl text-red-400 hover:text-white"
            >
              <LogOut size={22} />
            </button>
          </div>
        </div>

        <div className="w-96 bg-slate-900/40 border-l border-white/10 flex flex-col h-full">
          <div className="p-4 bg-slate-900/60 border-b border-white/5 flex items-center gap-2">
            <MessageSquare size={18} className="text-blue-400" />
            <h2 className="font-semibold text-sm">Chat en directo</h2>
          </div>

          <div className="flex-1 p-4 overflow-y-auto flex flex-col gap-3">
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex flex-col p-3 rounded-xl max-w-[85%] ${msg.sender === "Host" ? 'bg-blue-600/20 border border-blue-500/30 self-end' : 'bg-slate-800 border border-slate-700 self-start'}`}>
                <div className="flex items-baseline gap-2 mb-1">
                  <span className={`text-xs font-bold ${msg.sender === "Host (Host)" ? 'text-blue-300' : 'text-slate-300'}`}>{msg.sender}</span>
                  <span className="text-[10px] text-slate-500">{msg.time}</span>
                </div>
                <p className="text-sm text-slate-200 break-words">{msg.text}</p>
              </div>
            ))}
          </div>

          <form onSubmit={sendMessage} className="p-4 bg-slate-900/60 border-t border-white/5 flex gap-2">
            <input
              type="text"
              value={messageInput}
              onChange={(e) => setMessageInput(e.target.value)}
              placeholder="Enviar un mensaje..."
              className="flex-1 bg-slate-800 text-sm px-4 py-2.5 rounded-xl border border-slate-700 focus:outline-none focus:border-blue-500 text-slate-100"
            />
            <button type="submit" className="p-3 bg-blue-600 hover:bg-blue-500 rounded-xl transition-colors text-white">
              <Send size={18} />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default StreamHostAgora;