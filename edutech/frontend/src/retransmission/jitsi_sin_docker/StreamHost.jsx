// pages/StreamHost.jsx
import { JitsiMeeting } from '@jitsi/react-sdk';

const StreamHost2 = () => {
  return (
    <div className="h-screen w-full bg-gray-900">
      <JitsiMeeting
        domain="meet.jit.si" 
        roomName="Clase_De_Prueba_Privada"
        configOverwrite={{
          startWithAudioMuted: false,
          disableModeratorIndicator: false,
          startScreenSharing: true,
        }}
        interfaceConfigOverwrite={{
          DISABLE_JOIN_LEAVE_NOTIFICATIONS: true,
          TOOLBAR_BUTTONS: [
            'microphone', 'camera', 'closedcaptions', 'desktop', 'fullscreen',
            'fodeviceselection', 'hangup', 'profile', 'chat', 'recording',
            'livestreaming', 'etherpad', 'sharedvideo', 'settings', 'raisehand',
            'videoquality', 'filmstrip', 'invite', 'feedback', 'stats', 'shortcuts',
            'tileview', 'videobackgroundblur', 'download', 'help', 'mute-everyone',
            'security'
          ],
        }}
        userInfo={{ displayName: 'Profesor (Anfitrión)' }}
        getIFrameRef={(node) => { node.style.height = '100%'; node.style.width = '100%'; }}
      />
    </div>
  );
};
export default StreamHost2;