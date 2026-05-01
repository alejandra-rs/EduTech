import React, { useState } from 'react';
import AgoraRTC, {
  AgoraRTCProvider,
  LocalVideoTrack,
  LocalAudioTrack,
  useJoin,
  useLocalCameraTrack,
  useLocalMicrophoneTrack,
  usePublish,
} from "agora-rtc-react";
import { Mic, MicOff, Video, VideoOff, LogOut } from 'lucide-react';

// CORRECTO: En la v2, el cliente se crea así:
const client = AgoraRTC.createClient({ mode: "rtc", codec: "vp8" });

const StreamHostAgora = () => {
  const [appId] = useState("TU_APP_ID_DE_AGORA"); // Consíguelo en console.agora.io
  const [channel] = useState("sala-pruebas");
  const [token] = useState(null); // En desarrollo puedes dejarlo null

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

  // Unirse al canal
  useJoin({ appid: appId, channel: channel, token: token }, active);

  // Crear pistas de audio y video
  const { localMicrophoneTrack } = useLocalMicrophoneTrack(micOn);
  const { localCameraTrack } = useLocalCameraTrack(videoOn);

  // Publicar las pistas para que otros las vean
  usePublish([localMicrophoneTrack, localCameraTrack]);

  return (
    <div className="h-screen w-full bg-slate-950 flex flex-col text-white">
      <div className="p-4 bg-slate-900 flex justify-between items-center border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="bg-red-500 h-3 w-3 rounded-full animate-ping" />
          <span className="font-bold">AGORA HOST: {channel}</span>
        </div>
      </div>

      <div className="flex-1 relative flex items-center justify-center p-10">
        <div className="w-full max-w-4xl aspect-video bg-black rounded-3xl overflow-hidden shadow-2xl border border-white/5">
          <LocalVideoTrack track={localCameraTrack} play className="w-full h-full object-cover" />
          {!videoOn && (
            <div className="absolute inset-0 bg-slate-900 flex items-center justify-center">
               <VideoOff size={64} className="text-slate-700" />
            </div>
          )}
        </div>

        {/* Controles */}
        <div className="absolute bottom-16 flex gap-6 bg-slate-900/90 p-5 rounded-3xl backdrop-blur-md border border-white/10">
          <button onClick={() => setMic(!micOn)} className={`p-4 rounded-2xl ${!micOn ? 'bg-red-500' : 'bg-slate-700'}`}>
            {micOn ? <Mic /> : <MicOff />}
          </button>
          <button onClick={() => setVideo(!videoOn)} className={`p-4 rounded-2xl ${!videoOn ? 'bg-red-500' : 'bg-slate-700'}`}>
            {videoOn ? <Video /> : <VideoOff />}
          </button>
          <button onClick={() => setActive(false)} className="p-4 bg-red-600 rounded-2xl hover:bg-red-700">
            <LogOut />
          </button>
        </div>
      </div>
    </div>
  );
};

export default StreamHostAgora;