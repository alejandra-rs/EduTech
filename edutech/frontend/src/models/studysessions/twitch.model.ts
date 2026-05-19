export interface TwitchChatMessage {
  chatter: string;
  color: string;
  text: string;
  message_id: string;
}

export interface TwitchLinkStatus {
  connected: boolean;
  login: string | null;
}
