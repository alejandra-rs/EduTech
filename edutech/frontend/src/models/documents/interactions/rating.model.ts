export interface InteractionResponse {
  id: number;
  count: number;
}

export interface ToggleInteractionPayload {
  user: number;
  post: number;
}