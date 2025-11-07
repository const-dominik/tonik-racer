import type { GameState, Player } from "@/types/types";
import { broadcast, broadcastPlayerList, getSentence } from "./utils";

class GameManager {
    private state: GameState;
    private players: Map<string, Player>;
    private countdownInterval: NodeJS.Timeout | null = null;
    private gameInterval: NodeJS.Timeout | null = null;

    constructor(players: Map<string, Player>) {
        this.players = players;
        this.state = {
            started: false,
            countdown: 0,
            text: "",
        };
    }

    getState(): GameState {
        return this.state;
    }

    start() {
        this.cleanup();
        this.state.started = false;
        this.state.text = "";
        this.state.countdown = 5;

        this.countdownInterval = setInterval(() => {
            broadcast({ type: "countdown", countdown: this.state.countdown });

            if (this.state.countdown <= 0) {
                this.clearCountdown();
                this.startRound();
            } else {
                this.state.countdown -= 1;
            }
        }, 1000);
    }

    stop(winner: string) {
        this.cleanup();

        this.state.started = false;

        broadcast({
            type: "gameEnd",
            winner,
        });

        this.resetPlayers();
        broadcastPlayerList();

        this.start();
    }

    private startRound() {
        this.state.started = true;
        this.state.text = getSentence();
        this.state.countdown = 20;

        this.resetPlayers();

        broadcast({
            type: "start",
            text: this.state.text,
            countdown: this.state.countdown,
        });

        this.gameInterval = setInterval(() => {
            broadcast({
                type: "countdown",
                countdown: this.state.countdown,
            });

            if (this.state.countdown === 0) {
                this.clearGame();
                this.endRound();
                this.start();
            } else {
                this.state.countdown -= 1;
            }
        }, 1000);
    }

    private endRound() {
        this.resetPlayers();
        broadcast({ type: "gameEnd" });
        broadcastPlayerList();
    }

    private resetPlayers() {
        this.players.forEach((player) => {
            player.progress = 0;
            player.startTime = null;
            player.wpm = 0;
            player.accuracy = 0;
        });
    }

    private clearCountdown() {
        if (this.countdownInterval) {
            clearInterval(this.countdownInterval);
            this.countdownInterval = null;
        }
    }

    private clearGame() {
        if (this.gameInterval) {
            clearInterval(this.gameInterval);
            this.gameInterval = null;
        }
    }

    private cleanup() {
        this.clearCountdown();
        this.clearGame();
    }
}

export const players = new Map<string, Player>();
export const gameManager = new GameManager(players);
