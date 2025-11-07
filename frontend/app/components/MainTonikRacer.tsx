import { useCallback, useEffect, useRef, useState } from "react";
import type { SentPlayer, WsData } from "../../../types/types";
import PlayerTable from "./PlayerTable";

const MainTonikRacer = ({ nickname }: { nickname: string }) => {
    const [text, setText] = useState("");
    const [countdown, setCountdown] = useState(0);
    const wsRef = useRef<WebSocket | null>(null);
    const [progress, setProgress] = useState(0);
    const [players, setPlayers] = useState<SentPlayer[]>([]);

    const connect = useCallback(() => {
        const ws = new WebSocket("ws://localhost:8000/ws");
        wsRef.current = ws;

        ws.onopen = () => {
            ws.send(JSON.stringify({ type: "join", nickname }));
        };

        ws.onmessage = (event) => {
            const data: WsData = JSON.parse(event.data);

            switch (data.type) {
                case "countdown":
                    setCountdown(data.countdown);
                    break;
                case "start":
                    setText(data.text);
                    setCountdown(data.countdown);
                    setProgress(0);
                    break;
                case "progress":
                    setPlayers(data.players);
                    break;
                case "gameEnd":
                    setText("");
                    setProgress(0);
                    break;
            }
        };
    }, [nickname]);

    useEffect(() => {
        connect();
    }, [connect]);

    const handleTyping = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;

        if (val[val.length - 1] === text[progress]) {
            setProgress(progress + 1);

            wsRef.current?.send(
                JSON.stringify({ type: "progress", progress: val.length })
            );
        }
    };

    return (
        <main className="h-screen w-screen flex-col bg-amber-200 p-6">
            <h2 className="mb-4 text-2xl">Countdown: {countdown}</h2>

            {text && (
                <div>
                    <p className="mb-2">Text to type:</p>
                    <p className="mb-4 rounded border bg-amber-100 p-2 font-mono">
                        {text}
                    </p>
                    <input
                        type="text"
                        value={text.slice(0, progress)}
                        onChange={handleTyping}
                        className="w-full rounded border p-2"
                    />
                    <h3 className="mt-6 mb-2 text-lg font-bold">Players:</h3>
                    <PlayerTable players={players} />
                </div>
            )}
        </main>
    );
};

export default MainTonikRacer;
