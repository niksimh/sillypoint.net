import type { WebSocket } from "ws";

export interface Player{
  username: string,
  socket: WebSocket | null,
  status: string
}