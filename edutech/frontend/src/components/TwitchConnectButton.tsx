import React from "react";

interface TwitchConnectButtonProps {
  userId: string | number;
  twitchData: { connected: boolean; login: string | null };
  setTwitchData: (data: { connected: boolean; login: string | null }) => void;
  connectTwitch: (userId: number) => Promise<string>;
  showValidationError?: boolean;
}

export const TwitchConnectButton: React.FC<TwitchConnectButtonProps> = ({
  userId,
  twitchData,
  setTwitchData,
  connectTwitch,
  showValidationError,
}) => {
  const isConnected = twitchData.connected && twitchData.login;
  const handleConnect = async () => {
    try {
      const login = await connectTwitch(Number(userId));
      setTwitchData({
        connected: true,
        login,
      });
    } catch (error: any) {
      if (error.message === "popup_closed") {
        console.log("El usuario cerró la ventana de Twitch.");
      } else {
        console.error("Error al conectar con Twitch:", error);
      }
    }
  };

  return (
    <>
      {!isConnected ? (
        <div className="text-center">
          <button
            type="button"
            className="flex items-center justify-center gap-3 w-full bg-[#9146FF] hover:bg-[#7d33eb] text-white font-semibold py-2.5 px-6 rounded-lg shadow-sm transition-colors duration-200 active:scale-95"
            onClick={handleConnect}
          >
            <svg
              className="w-10 h-10 fill-current"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M11.571 4.714h1.715v5.143H11.57zm4.715 0H18v5.143h-1.714zM6 0L1.714 4.286v15.428h5.143V24l4.286-4.286h3.428L22.286 12V0zm14.571 11.143l-3.428 3.428h-3.429l-3 3v-3H6.857V1.714h13.714Z" />
            </svg>
            Conecta tu cuenta de Twitch
          </button>
          {showValidationError && (
            <p className="mt-2 text-sm text-red-600">
              Necesitas conectar tu cuenta de Twitch para crear la sesión.
            </p>
          )}
        </div>
      ) : (
        <div className="text-center">
          <div className="p-4 bg-green-100 text-green-800 rounded-lg shadow-sm">
            <p className="font-semibold">
              Tu cuenta {twitchData.login} de Twitch está conectada
              correctamente.
            </p>
          </div>
        </div>
      )}
    </>
  );
};
