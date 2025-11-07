import cors from "@fastify/cors";
import Fastify, { FastifyInstance, RouteShorthandOptions } from "fastify";

async function start() {
    const server: FastifyInstance = Fastify({});

    await server.register(cors, {
        origin: "http://localhost:3000",
        credentials: true,
    });

    const opts: RouteShorthandOptions = {
        schema: {
            response: {
                200: {
                    type: "object",
                    properties: {
                        pong: { type: "string" },
                    },
                },
            },
        },
    };

    server.get("/ping", opts, async () => {
        return { pong: "it worked!" };
    });

    try {
        await server.listen({ port: 8000, host: "0.0.0.0" });
        console.log("Server running at http://localhost:8000");
    } catch (err) {
        server.log.error(err);
        process.exit(1);
    }
}

start();
