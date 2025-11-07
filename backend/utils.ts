import { Player, WsData } from "../types/types";
import { sentences } from "./data";
import { gameManager, players } from "./GameManager";

export const broadcast = (data: WsData) => {
    const msg = JSON.stringify(data);
    players.forEach((player) => player.connection.send(msg));
};

export const getSentence = () =>
    sentences[Math.floor(Math.random() * sentences.length)];

export const getCurrentGameStateJSON = () =>
    JSON.stringify({
        type: "start",
        text: gameManager.getState().text,
        countdown: gameManager.getState().countdown,
    });

export const broadcastPlayerList = () => {
    const msg = JSON.stringify({
        type: "progress",
        players: [...players.values()].map((p) => ({
            nickname: p.nickname,
            progress: p.progress,
            wpm: p.wpm,
            accuracy: p.accuracy,
        })),
    });
    players.forEach((p) => p.connection.send(msg));
};

export const calculateWPM = (player: Player): number => {
    if (!player.startTime || player.progress === 0) return 0;

    const timeElapsed = (Date.now() - player.startTime) / 1000 / 60;
    const wordsTyped = player.progress / 5;

    return Math.round(wordsTyped / timeElapsed);
};
