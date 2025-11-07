import type WebSocket from "ws";

export type Player = {
    nickname: string;
    progress: number;
    connection: WebSocket;
};

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
      };
