// pages/StreamViewer.jsx
import { JitsiMeeting } from '@jitsi/react-sdk';

const StreamViewer2 = () => {
  return (
    <div className="h-screen w-full bg-black">
      <JitsiMeeting
        domain="meet.jit.si"
        roomName="Clase_De_Prueba_Privada"
        configOverwrite={{
          startWithAudioMuted: false,
          startWithVideoMuted: false,
          readOnlyName: false,
        }}
        interfaceConfigOverwrite={{
          TOOLBAR_BUTTONS: ['chat', 'fullscreen'],
        }}
        userInfo={{ displayName: 'Estudiante' }}
        getIFrameRef={(node) => { node.style.height = '100%'; node.style.width = '100%'; }}
      />
    </div>
  );
};
export default StreamViewer2;