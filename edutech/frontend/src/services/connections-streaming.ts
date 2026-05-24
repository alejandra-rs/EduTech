import { TwitchChatMessage, TwitchLinkStatus } from "../models/studysessions/twitch.model";
import { apiFetchJson, apiFetchVoid, JSON_HEADERS } from "./api";

const BASE = "/api/study-sessions";

const buildWebSocketUrl = (path: string): string => {
  const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
  return `${protocol}//${window.location.host}${path}`;
};

export const getTwitchStatus = (): Promise<TwitchLinkStatus> =>
  apiFetchJson(`${BASE}/twitch/status/`);

export const disconnectTwitch = (): Promise<void> =>
  apiFetchVoid(`${BASE}/twitch/status/`, { method: "DELETE" });

export const connectTwitch = (): Promise<string> =>
  new Promise(async (resolve, reject) => {
    try {
      const { url } = await apiFetchJson<{ url: string }>(`${BASE}/twitch/auth/`);
      const popup = window.open(url, "TwitchOAuth", "width=520,height=700,scrollbars=yes,resizable=yes");

      let attempted = 0;
      const maxAttempts = 10;

      const pollBackend = setInterval(async () => {
        attempted++;
        try {
          const status = await getTwitchStatus();
          if (status.connected) {
            clearInterval(pollBackend);
            if (popup && !popup.closed) popup.close();
            resolve(status.login ?? "Desconocido");
          }
        } catch (err) {
          console.error("Error verificando estado de Twitch:", err);
        }
        if (attempted >= maxAttempts) {
          clearInterval(pollBackend);
          reject(new Error("timeout"));
        }
      }, 3000);
    } catch (err) {
      reject(err);
    }
  });

export const startStream = (sessionId: number): Promise<{ task_id: string }> =>
  apiFetchJson(`${BASE}/${sessionId}/stream/`, {
    method: "POST",
    headers: JSON_HEADERS,
    body: JSON.stringify({}),
  });

export const stopStream = (sessionId: number): Promise<void> =>
  apiFetchVoid(`${BASE}/${sessionId}/stream/`, { method: "DELETE" });

export const sendTwitchMessage = (sessionId: number, message: string): Promise<void> =>
  apiFetchJson(`${BASE}/${sessionId}/chat/`, {
    method: "POST",
    headers: JSON_HEADERS,
    body: JSON.stringify({ message }),
  });

interface SessionSocketCallbacks {
  onMessage?: (msg: TwitchChatMessage) => void;
  onStreamStarted?: () => void;
  onStreamEnded?: () => void;
}

export const connectToSessionChat = (
  sessionId: number,
  onMessage: (msg: TwitchChatMessage) => void,
  onStreamEnded?: () => void,
): WebSocket => connectToSession(sessionId, { onMessage, onStreamEnded });

export const connectToSession = (sessionId: number, { onMessage, onStreamStarted, onStreamEnded }: SessionSocketCallbacks): WebSocket => {
  const socket = new WebSocket(buildWebSocketUrl(`/ws/study-sessions/${sessionId}/`));
  socket.onmessage = (event) => {
    const data = JSON.parse(event.data);
    if (data.type === "stream_started") onStreamStarted?.();
    else if (data.type === "stream_ended") onStreamEnded?.();
    else onMessage?.(data as TwitchChatMessage);
  };
  return socket;
};
