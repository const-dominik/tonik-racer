import type WebSocket from "ws";

export type Player = {
    nickname: string;
    progress: number;
    connection: WebSocket;
    startTime: number | null;
    wpm?: number;
    accuracy?: number;
    wins: number;
    timestamp?: number;
};

export type SentPlayer = Omit<Player, "connection" | "timestamp">;

export type GameState = {
    started: boolean;
    countdown: number;
    text: string;
};

export type Stats = {
    nickname: string;
    wins: number;
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
    | { type: "gameEnd"; winner?: string }
    | { type: "JWT"; value: string }
    | { type: "stats"; stats: Stats };
