import type { Player } from "@/types/types";
import cors from "@fastify/cors";
import websocketPlugin from "@fastify/websocket";
import crypto from "crypto";
import Fastify, { FastifyInstance } from "fastify";
import { gameManager, players } from "./GameManager";
import { handleMessage } from "./handlers";
import { broadcastPlayerList } from "./utils";

const startServer = async () => {
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
            wpm: 0,
            accuracy: 0,
        };
        players.set(id, player);

        conn.on("message", (data) => handleMessage(player, data.toString()));

        conn.on("close", () => {
            players.delete(id);
            broadcastPlayerList();
        });
    });

    try {
        await server.listen({ port: 8000, host: "0.0.0.0" });
        console.log("Server running at http://localhost:8000");
    } catch (err) {
        server.log.error(err);
        process.exit(1);
    }
};

gameManager.start();
startServer();
