// StreamViewer.jsx
import React, { useEffect, useRef, useState } from 'react';
import Peer from 'peerjs';
import { Camera, Mic, MicOff, Video, VideoOff, Copy, LogOut } from 'lucide-react';

const StreamViewer3 = () => {
  const [hostId, setHostId] = useState(''); // El ID del profesor
  const [connected, setConnected] = useState(false);
  const remoteVideoRef = useRef(null);
  const peerInstance = useRef(null);

  useEffect(() => {
    const peer = new Peer();
    peerInstance.current = peer;
    return () => peer.destroy();
  }, []);

  const startWatching = () => {
    // El estudiante llama al host. No necesita enviar su propia cámara, 
    // así que enviamos un stream vacío o simplemente llamamos.
    const call = peerInstance.current.call(hostId, new MediaStream());

    call.on('stream', (remoteStream) => {
      // Cuando recibimos el video del profesor, lo ponemos en el <video>
      if (remoteVideoRef.current) {
        remoteVideoRef.current.srcObject = remoteStream;
        setConnected(true);
      }
    });
  };

  // Solo los cambios clave en el return del Viewer para que se vea Pro:
  return (
    <div className="h-screen w-full bg-black flex flex-col text-white">
      {!connected ? (
        <div className="flex-1 flex items-center justify-center bg-gradient-to-br from-slate-950 to-slate-900">
          <div className="bg-slate-900 border border-slate-800 p-8 rounded-3xl shadow-2xl w-96 text-center">
            <div className="mb-6 bg-blue-500/10 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto">
              <Camera className="text-blue-500" size={32}/>
            </div>
            <h2 className="text-2xl font-bold mb-2">Unirse a Clase</h2>
            <p className="text-slate-400 text-sm mb-6">Introduce el código del profesor para ver la retransmisión.</p>
            <input
              type="text"
              placeholder="ID de la sesión"
              className="w-full bg-slate-800 border border-slate-700 p-3 rounded-xl mb-4 focus:ring-2 focus:ring-blue-500 outline-none transition"
              value={hostId}
              onChange={(e) => setHostId(e.target.value)}
            />
            <button 
              onClick={startWatching}
              className="w-full bg-blue-600 hover:bg-blue-700 py-3 rounded-xl font-bold transition-all transform active:scale-95"
            >
              Entrar al Stream
            </button>
          </div>
        </div>
      ) : (
        <div className="relative h-screen w-full group">
          <video ref={remoteVideoRef} autoPlay className="w-full h-full object-contain" />
          
          {/* Overlay superior cuando el ratón se mueve */}
          <div className="absolute top-0 left-0 right-0 p-6 bg-gradient-to-b from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
            <p className="text-sm font-medium">Viendo la clase de: <span className="text-blue-400">{hostId}</span></p>
          </div>
        </div>
      )}
    </div>
  );
};

export default StreamViewer3;