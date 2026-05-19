import React, { useState } from "react";
import { disconnectTwitch } from "../services/connections-streaming";

interface TwitchConnectButtonProps {
  userId: string | number;
  twitchData: { connected: boolean; login: string | null };
  setTwitchData: (data: { connected: boolean; login: string | null }) => void;
  connectTwitch: (userId: number) => Promise<string>;
  showValidationError?: boolean;
  variant?: "modal" | "profile";
}

export const TwitchConnectButton: React.FC<TwitchConnectButtonProps> = ({
  userId,
  twitchData,
  setTwitchData,
  connectTwitch,
  showValidationError,
  variant = "modal",
}) => {
  const [loading, setLoading] = useState(false);
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

  const handleDisconnect = async () => {
    if (!disconnectTwitch) return;
    setLoading(true);
    try {
      await disconnectTwitch(Number(userId));
      setTwitchData({ connected: false, login: null });
    } catch (error) {
      console.error("Error al desconectar Twitch:", error);
    } finally {
      setLoading(false);
    }
  };
  switch (variant) {
    case "modal":
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
    case "profile":
      return (
        <div className="flex items-center justify-between p-4 border border-gray-200 rounded-xl bg-white shadow-sm">
          <div className="flex items-center gap-4">
            <div className="bg-[#9146FF] p-2.5 rounded-lg text-white">
              <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
                <path d="M11.571 4.714h1.715v5.143H11.57zm4.715 0H18v5.143h-1.714zM6 0L1.714 4.286v15.428h5.143V24l4.286-4.286h3.428L22.286 12V0zm14.571 11.143l-3.428 3.428h-3.429l-3 3v-3H6.857V1.714h13.714Z" />
              </svg>
            </div>
            <div>
              <p className="font-semibold text-gray-900">Twitch</p>
              <p
                className={`text-sm ${isConnected ? "text-green-600 font-medium" : "text-gray-500"}`}
              >
                {isConnected
                  ? `Conectado como ${twitchData.login}`
                  : "No conectado"}
              </p>
            </div>
          </div>

          <div>
            {isConnected ? (
              <button
                onClick={handleDisconnect}
                disabled={loading}
                className="px-4 py-2 text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors disabled:opacity-50"
              >
                {loading ? "Desconectando..." : "Desconectar"}
              </button>
            ) : (
              <button
                onClick={handleConnect}
                disabled={loading}
                className="px-4 py-2 text-sm font-medium text-white bg-[#9146FF] hover:bg-[#7d33eb] rounded-lg transition-colors shadow-sm disabled:opacity-50"
              >
                {loading ? "Conectando..." : "Conectar"}
              </button>
            )}
          </div>
        </div>
      );
  }
};

export default TwitchConnectButton;
