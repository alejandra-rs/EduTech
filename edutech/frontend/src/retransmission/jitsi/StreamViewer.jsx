import { JitsiMeeting } from '@jitsi/react-sdk';

const StreamViewer = () => {
  return (
    <div className="h-screen w-full bg-black">
      <JitsiMeeting
        domain="localhost:8443" 
        roomName="Clase_De_Prueba_Privada"
        configOverwrite={{
          startWithAudioMuted: false,
          startWithVideoMuted: false,
          readOnlyName: false,
        }}
        interfaceConfigOverwrite={{
          TOOLBAR_BUTTONS: [
            'microphone', 'camera', 'closedcaptions', 'desktop', 'fullscreen',
            'fodeviceselection', 'hangup', 'profile', 'chat', 'recording',
            'livestreaming', 'etherpad', 'sharedvideo', 'settings', 'raisehand',
            'videoquality', 'filmstrip', 'invite', 'feedback', 'stats', 'shortcuts',
            'tileview', 'videobackgroundblur', 'download', 'help', 'mute-everyone',
            'security'
          ],
        }}
        userInfo={{ displayName: 'Estudiante' }}
        getIFrameRef={(node) => { node.style.height = '100%'; node.style.width = '100%'; }}
      />
    </div>
  );
};
export default StreamViewer;