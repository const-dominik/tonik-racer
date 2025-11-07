import { Player } from "@/types/types";
import { gameManager } from "./GameManager";
import {
    broadcastPlayerList,
    calculateWPM,
    getCurrentGameStateJSON,
} from "./utils";

export const handleMessage = (player: Player, raw: string) => {
    try {
        const data = JSON.parse(raw);

        if (data.type === "join") {
            player.nickname = data.nickname;

            player.connection.send(getCurrentGameStateJSON());

            broadcastPlayerList();
        }
        if (data.type === "progress") {
            if (player.progress === gameManager.getState().text.length - 1) {
                gameManager.stop(player.nickname);
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
