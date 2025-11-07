import { useCallback, useEffect, useRef, useState } from "react";
import type { WsData } from "../../../types/types";

const MainTonikRacer = ({ nickname }: { nickname: string }) => {
    const [text, setText] = useState("");
    const [countdown, setCountdown] = useState(0);
    const wsRef = useRef<WebSocket | null>(null);
    const [progress, setProgress] = useState(0);

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
        <main className="p-6">
            <h2 className="mb-4 text-2xl">Countdown: {countdown}</h2>
            <p className="mb-2">Text to type:</p>
            <p className="mb-4 rounded border bg-gray-100 p-2 font-mono">
                {text}
            </p>
            <input
                type="text"
                value={text.slice(0, progress)}
                onChange={handleTyping}
                className="w-full rounded border p-2"
            />
        </main>
    );
};

export default MainTonikRacer;
