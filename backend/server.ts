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
    state.countdown = 10;
    state.text = getSentence();

    const countdown = setInterval(() => {
        state.countdown -= 1;

        if (state.countdown > 0) {
            broadcast({ type: "countdown", countdown: state.countdown });
        } else {
            clearInterval(countdown);

            gameLoop();
        }
    }, 1000);
};

const gameLoop = () => {
    state.started = true;
    state.countdown = 30;
    broadcast({ type: "start", text: state.text, countdown: 30 });

    const game = setInterval(() => {
        state.countdown -= 1;

        if (state.countdown > 0) {
            broadcast({ type: "countdown", countdown: state.countdown });
        } else {
            clearInterval(game);
            startGame();
        }
    }, 1000);
};

const getCurrentGameStateJSON = () =>
    JSON.stringify({
        type: "start",
        text: state.text,
        countdown: state.countdown,
    });

const handleMessage = (player: Player, raw: string) => {
    try {
        const data = JSON.parse(raw);

        if (data.type === "join") {
            player.nickname = data.nickname;

            player.connection.send(getCurrentGameStateJSON());
        }
    } catch {}
};

startGame();
start();
