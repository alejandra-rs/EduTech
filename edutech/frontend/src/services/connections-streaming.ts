import { TwitchChatMessage, TwitchLinkStatus } from "../models/studysessions/twitch.model";
import { apiFetch } from "./api";

const BASE = "/api/study-sessions";

export const getTwitchStatus = async (studentId: number): Promise<TwitchLinkStatus> => {
  const response = await apiFetch(`${BASE}/twitch/status/?student_id=${studentId}`);
  if (!response.ok) throw new Error("Error al verificar el estado de Twitch");
  return response.json();
};

export const disconnectTwitch = async (studentId: number): Promise<void> => {
  const response = await apiFetch(
    `${BASE}/twitch/status/?student_id=${studentId}`,
    { method: "DELETE" }
  );
  if (!response.ok) throw new Error("Error al desconectar Twitch");
};

export const connectTwitch = (studentId: number): Promise<string> => {
  return new Promise((resolve, reject) => {
    const popup = window.open(
      `${BASE}/twitch/auth/?student_id=${studentId}`,
      "TwitchOAuth",
      "width=520,height=700,scrollbars=yes,resizable=yes"
    );

    const onMessage = (event: MessageEvent) => {
      if (event.origin !== window.location.origin) return;

      if (event.data?.type === "TWITCH_AUTH_SUCCESS") {
        cleanup();
        resolve(event.data.payload.login as string);
      } else if (event.data?.type === "TWITCH_AUTH_ERROR") {
        cleanup();
        reject(new Error(event.data.payload.error as string));
      }
    };

    const pollClosed = setInterval(() => {
      if (popup?.closed) {
        cleanup();
        reject(new Error("popup_closed"));
      }
    }, 500);

    const cleanup = () => {
      window.removeEventListener("message", onMessage);
      clearInterval(pollClosed);
      popup?.close();
    };

    window.addEventListener("message", onMessage);
  });
};


export const startStream = async (sessionId: number, studentId: number): Promise<{ task_id: string }> => {
  const response = await apiFetch(`${BASE}/${sessionId}/stream/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ student_id: studentId }),
  });
  if (!response.ok) {
    const data = await response.json().catch(() => ({}));
    throw Object.assign(new Error(data.detail ?? "Error al iniciar el stream"), {
      status: response.status,
      code: data.code,
    });
  }
  return response.json();
};

export const stopStream = async (sessionId: number): Promise<void> => {
  const response = await apiFetch(`${BASE}/${sessionId}/stream/`, { method: "DELETE" });
  if (!response.ok) throw new Error("Error al detener el stream");
};

export const sendTwitchMessage = async (sessionId: number, studentId: number, message: string): Promise<void> => {
  const response = await apiFetch(`${BASE}/${sessionId}/chat/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ student_id: studentId, message }),
  });
  if (!response.ok) {
    const data = await response.json().catch(() => ({}));
    throw Object.assign(new Error(data.detail ?? "Error al enviar el mensaje"), {
      status: response.status,
      code: data.code,
    });
  }
};

export const connectToSessionChat = (
  sessionId: number,
  onMessage: (msg: TwitchChatMessage) => void
): WebSocket => {
  const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
  const socket = new WebSocket(
    `${protocol}//${window.location.host}/ws/study-sessions/${sessionId}/`
  );
  socket.onmessage = (event) =>
    onMessage(JSON.parse(event.data) as TwitchChatMessage);
  return socket;
};
