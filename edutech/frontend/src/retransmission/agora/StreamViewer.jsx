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

const StreamViewerAgora = () => {
  const [appId] = useState("TU_APP_ID_DE_AGORA");
  const [channel] = useState("sala-pruebas");

  return (
    <AgoraRTCProvider client={client}>
      <div className="h-screen w-full bg-black flex items-center justify-center">
        <ViewerCanvas appId={appId} channel={channel} />
      </div>
    </AgoraRTCProvider>
  );
};

const ViewerCanvas = ({ appId, channel }) => {
  useJoin({ appid: appId, channel: channel, token: null }, true);
  const remoteUsers = useRemoteUsers(); // Detecta quién está emitiendo

  return (
    <div className="w-full h-full flex flex-wrap justify-center items-center gap-4">
      {remoteUsers.length > 0 ? (
        remoteUsers.map((user) => (
          <div key={user.uid} className="w-full h-full max-w-5xl aspect-video">
            <RemoteUser user={user} playVideo playAudio style={{ width: '100%', height: '100%' }} />
          </div>
        ))
      ) : (
        <div className="text-white text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p>Esperando a que el profesor inicie la clase...</p>
        </div>
      )}
    </div>
  );
};

export default StreamViewerAgora;