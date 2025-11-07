import type { SentPlayer, WsData } from "@/types/types";
import { useCallback, useEffect, useRef, useState } from "react";
import PlayerTable from "./PlayerTable";

const MainTonikRacer = ({ nickname }: { nickname: string }) => {
    const [text, setText] = useState("");
    const [countdown, setCountdown] = useState(0);
    const [progress, setProgress] = useState(0);
    const [players, setPlayers] = useState<SentPlayer[]>([]);
    const [errors, setErrors] = useState(0);
    const [isConnected, setIsConnected] = useState(false);

    const wsRef = useRef<WebSocket | null>(null);

    const calculateAccuracy = useCallback(
        (correct: number, total: number): number => {
            if (total === 0) return 100;
            return Math.round((correct / total) * 100);
        },
        []
    );

    const sendProgress = useCallback(
        (newProgress: number, newErrors: number) => {
            if (!wsRef.current) return;

            const accuracy = calculateAccuracy(
                newProgress,
                newProgress + newErrors
            );

            wsRef.current.send(
                JSON.stringify({
                    type: "progress",
                    progress: newProgress,
                    accuracy,
                })
            );
        },
        [calculateAccuracy]
    );

    const resetGameState = useCallback(() => {
        setProgress(0);
        setErrors(0);
    }, []);

    const handleMessage = useCallback(
        (event: MessageEvent) => {
            try {
                const data: WsData = JSON.parse(event.data);

                switch (data.type) {
                    case "countdown":
                        setCountdown(data.countdown);
                        break;

                    case "start":
                        setText(data.text);
                        setCountdown(data.countdown);
                        resetGameState();
                        break;

                    case "progress":
                        setPlayers(data.players);
                        break;

                    case "gameEnd":
                        setText("");
                        resetGameState();
                        break;
                }
            } catch (error) {
                console.error("Failed to parse WebSocket message:", error);
            }
        },
        [resetGameState]
    );

    const connect = useCallback(() => {
        if (wsRef.current?.readyState === WebSocket.OPEN) {
            wsRef.current.close();
        }

        const ws = new WebSocket("ws://localhost:8000/ws");
        wsRef.current = ws;

        ws.onopen = () => {
            ws.send(JSON.stringify({ type: "join", nickname }));
            setIsConnected(true);
        };

        ws.onmessage = handleMessage;
        ws.onclose = () => setIsConnected(false);

        return ws;
    }, [nickname, handleMessage]);

    useEffect(() => {
        const ws = connect();

        return () => {
            if (ws.readyState === WebSocket.OPEN) {
                ws.close();
            }
        };
    }, [connect]);

    const handleTyping = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (progress >= text.length) {
            return;
        }

        const val = e.target.value;
        const lastChar = val[val.length - 1];
        const expectedChar = text[progress];

        if (lastChar === expectedChar) {
            setProgress(progress + 1);
            sendProgress(progress + 1, errors);
        } else {
            setErrors(errors + 1);
        }
    };

    const currentAccuracy = calculateAccuracy(progress, progress + errors);

    if (!isConnected) {
        return (
            <main className="flex min-h-screen w-full items-center justify-center bg-amber-100">
                <div className="text-center text-2xl">
                    Trying to connect to server...
                </div>
            </main>
        );
    }

    return (
        <main className="flex min-h-screen w-full flex-col bg-amber-100 p-6">
            <div className="mx-auto w-full max-w-4xl">
                <h2 className="mb-4 text-2xl font-bold">
                    Countdown: {countdown}
                </h2>

                {text ? (
                    <div>
                        <div>
                            <p className="mb-2 text-sm font-medium">
                                Text to type:
                            </p>
                            <p className="mb-4 rounded border bg-amber-100 p-4 font-mono text-lg leading-relaxed">
                                <span className="font-semibold text-green-600">
                                    {text.slice(0, progress)}
                                </span>
                                <span className="text-gray-700">
                                    {text.slice(progress)}
                                </span>
                            </p>
                        </div>

                        <div>
                            <input
                                type="text"
                                value={text.slice(0, progress)}
                                onChange={handleTyping}
                                className="w-full rounded border-2 border-amber-300 p-3 font-mono text-lg outline-none focus:border-amber-500"
                                placeholder="Start typing..."
                                autoFocus
                                autoComplete="off"
                                spellCheck={false}
                            />
                            <div className="mt-2 flex gap-4 text-sm text-gray-700">
                                <span>
                                    Progress: {progress}/{text.length}
                                </span>
                                <span>Errors: {errors}</span>
                                <span>Accuracy: {currentAccuracy}%</span>
                            </div>
                        </div>

                        <div>
                            <h3 className="mb-2 text-lg font-bold">Players:</h3>
                            <PlayerTable
                                players={players}
                                textLength={text.length}
                            />
                        </div>
                    </div>
                ) : (
                    <div className="flex items-center justify-center py-12">
                        <p className="text-lg text-amber-800">
                            Waiting for game to start...
                        </p>
                    </div>
                )}
            </div>
        </main>
    );
};

export default MainTonikRacer;
