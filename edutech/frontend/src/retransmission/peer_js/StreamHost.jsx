import React, { useEffect, useRef, useState } from 'react';
import Peer from 'peerjs';
import { Camera, Mic, MicOff, Video, VideoOff, Copy, LogOut } from 'lucide-react'; // Instala lucide-react

const StreamHost3 = () => {
  const [peerId, setPeerId] = useState('');
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [stream, setStream] = useState(null);
  
  const localVideoRef = useRef(null);
  const peerInstance = useRef(null);

  useEffect(() => {
    const peer = new Peer();
    peer.on('open', (id) => setPeerId(id));

    navigator.mediaDevices.getUserMedia({ video: true, audio: true })
      .then((mediaStream) => {
        setStream(mediaStream);
        if (localVideoRef.current) localVideoRef.current.srcObject = mediaStream;

        peer.on('call', (call) => {
          call.answer(mediaStream);
        });
      });

    peerInstance.current = peer;
    return () => {
        peer.destroy();
        stream?.getTracks().forEach(track => track.stop());
    };
  }, []);

  // --- CONTROLES ---
  const toggleMic = () => {
    stream.getAudioTracks()[0].enabled = !isMuted;
    setIsMuted(!isMuted);
  };

  const toggleVideo = () => {
    stream.getVideoTracks()[0].enabled = !isVideoOff;
    setIsVideoOff(!isVideoOff);
  };

  const copyId = () => {
    navigator.clipboard.writeText(peerId);
    alert("ID Copiado: " + peerId);
  };

  return (
    <div className="h-screen w-full bg-slate-950 flex flex-col text-white font-sans">
      {/* Header con ID */}
      <div className="p-4 bg-slate-900 border-b border-slate-800 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <div className="bg-red-600 px-3 py-1 rounded text-xs font-bold animate-pulse">EN VIVO</div>
          <h1 className="text-lg font-semibold">Sala de Transmisión</h1>
        </div>
        <div className="flex items-center gap-2 bg-slate-800 p-2 rounded-lg border border-slate-700">
          <span className="text-slate-400 text-sm">ID: {peerId}</span>
          <button onClick={copyId} className="p-1 hover:bg-slate-700 rounded transition"><Copy size={18}/></button>
        </div>
      </div>

      {/* Video Principal */}
      <div className="relative flex-1 flex items-center justify-center p-6">
        <div className="relative w-full max-w-5xl aspect-video bg-black rounded-2xl overflow-hidden shadow-2xl border border-slate-800">
          <video ref={localVideoRef} autoPlay muted className="w-full h-full object-cover" />
          {isVideoOff && (
            <div className="absolute inset-0 bg-slate-900 flex items-center justify-center">
              <div className="w-32 h-32 bg-slate-800 rounded-full flex items-center justify-center border-2 border-slate-700">
                <VideoOff size={48} className="text-slate-500" />
              </div>
            </div>
          )}
        </div>

        {/* Barra de Controles Flotante */}
        <div className="absolute bottom-12 flex gap-4 bg-slate-900/80 backdrop-blur-md p-4 rounded-2xl border border-white/10 shadow-xl">
          <button onClick={toggleMic} className={`p-4 rounded-xl transition ${isMuted ? 'bg-red-500' : 'bg-slate-700 hover:bg-slate-600'}`}>
            {isMuted ? <MicOff size={24}/> : <Mic size={24}/>}
          </button>
          <button onClick={toggleVideo} className={`p-4 rounded-xl transition ${isVideoOff ? 'bg-red-500' : 'bg-slate-700 hover:bg-slate-600'}`}>
            {isVideoOff ? <VideoOff size={24}/> : <Video size={24}/>}
          </button>
          <button className="p-4 bg-red-600 hover:bg-red-700 rounded-xl transition">
            <LogOut size={24}/>
          </button>
        </div>
      </div>
    </div>
  );
};

export default StreamHost3;