import cors from "@fastify/cors";
import websocketPlugin from "@fastify/websocket";
import crypto from "crypto";
import Fastify, { FastifyInstance } from "fastify";
import type { GameState, Player, WsData } from "../types/types";
import { sentences } from "./data";

const players = new Map<string, Player>();
const state: GameState = {
    started: false,
    countdown: 0,
    text: "",
};

async function start() {
    const server: FastifyInstance = Fastify({});

    await server.register(cors, {
        origin: "http://localhost:3000",
        credentials: true,
    });
    await server.register(websocketPlugin);

    server.get("/ws", { websocket: true }, (conn) => {
        const id = crypto.randomUUID();
        const player: Player = {
            nickname: "",
            progress: 0,
            connection: conn,
            startTime: null,
        };
        players.set(id, player);

        conn.on("message", (data) => handleMessage(player, data.toString()));

        conn.on("close", () => {
            players.delete(id);
        });
    });

    try {
        await server.listen({ port: 8000, host: "0.0.0.0" });
        console.log("Server running at http://localhost:8000");
    } catch (err) {
        server.log.error(err);
        process.exit(1);
    }
}

const broadcast = (data: WsData) => {
    const msg = JSON.stringify(data);
    players.forEach((player) => player.connection.send(msg));
};

const getSentence = () =>
    sentences[Math.floor(Math.random() * sentences.length)];

const startGame = () => {
    state.started = false;
    state.text = "";
    state.countdown = 10;

    const countdownInterval = setInterval(() => {
        broadcast({ type: "countdown", countdown: state.countdown });

        if (state.countdown <= 0) {
            clearInterval(countdownInterval);
            gameLoop();
        } else {
            state.countdown -= 1;
        }
    }, 1000);
};

const endGame = () => {
    players.forEach((player) => {
        player.progress = 0;
    });

    broadcast({ type: "gameEnd" });
    broadcastPlayerList();
};

const gameLoop = () => {
    state.started = true;
    state.text = getSentence();
    state.countdown = 15;

    broadcast({
        type: "start",
        text: state.text,
        countdown: state.countdown,
    });

    const gameInterval = setInterval(() => {
        broadcast({
            type: "countdown",
            countdown: state.countdown,
        });

        if (state.countdown <= 0) {
            clearInterval(gameInterval);
            endGame();
            startGame();
        } else {
            state.countdown -= 1;
        }
    }, 1000);
};

const getCurrentGameStateJSON = () =>
    JSON.stringify({
        type: "start",
        text: state.text,
        countdown: state.countdown,
    });

const broadcastPlayerList = () => {
    const msg = JSON.stringify({
        type: "progress",
        players: [...players.values()].map((p) => ({
            nickname: p.nickname,
            progress: p.progress,
        })),
    });
    players.forEach((p) => p.connection.send(msg));
};

const handleMessage = (player: Player, raw: string) => {
    try {
        const data = JSON.parse(raw);

        if (data.type === "join") {
            player.nickname = data.nickname;

            player.connection.send(getCurrentGameStateJSON());

            broadcastPlayerList();
        }
        if (data.type === "progress") {
            player.progress = data.progress;

            broadcastPlayerList();
        }
    } catch {}
};

startGame();
start();
