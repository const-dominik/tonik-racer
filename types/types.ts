import type WebSocket from "ws";

export type Player = {
    nickname: string;
    progress: number;
    connection: WebSocket;
    startTime: number | null;
    wpm?: number;
    accuracy?: number;
};

export type SentPlayer = Omit<Player, "connection">;

export type GameState = {
    started: boolean;
    countdown: number;
    text: string;
};

export type WsData =
    | {
          type: "start";
          text: string;
          countdown: number;
      }
    | {
          type: "countdown";
          countdown: number;
      }
    | { type: "progress"; players: Player[] }
    | { type: "gameEnd" };
