import { Player } from "@/types/types";
import { gameManager } from "./GameManager";
import { generateStatsToken, verifyStatsToken } from "./jwt";
import {
    broadcastPlayerList,
    calculateWPM,
    getCurrentGameStateJSON,
} from "./utils";

export const handleMessage = (player: Player, raw: string) => {
    try {
        const data = JSON.parse(raw);

        if (data.type === "join") {
            let payload = null;

            if (data.jwt) {
                payload = verifyStatsToken(data.jwt);
            }

            if (data.nickname) {
                const [jwt, newPayload] = generateStatsToken(data.nickname);
                payload = newPayload;

                player.connection.send(
                    JSON.stringify({ type: "JWT", value: jwt })
                );
            }

            if (payload) {
                player.nickname = payload.nickname;
                player.wins = payload.wins;
                player.timestamp = payload.timestamp;
            }

            player.connection.send(
                JSON.stringify({
                    type: "stats",
                    stats: {
                        nickname: player.nickname,
                        wins: player.wins,
                    },
                })
            );

            player.connection.send(getCurrentGameStateJSON());

            broadcastPlayerList();
        }
        if (data.type === "progress") {
            if (player.progress === gameManager.getState().text.length - 1) {
                gameManager.win(player);
                return;
            }

            if (player.startTime === null && data.progress > 0) {
                player.startTime = Date.now();
            }

            player.progress = data.progress;
            player.accuracy = data.accuracy;
            player.wpm = calculateWPM(player);

            broadcastPlayerList();
        }
    } catch {}
};
