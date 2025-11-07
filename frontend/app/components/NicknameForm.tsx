"use client";

import { useState } from "react";

export const NicknameForm = ({
    updateVal,
}: {
    updateVal: (val: string) => void;
}) => {
    const [nickname, setNickname] = useState("");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!nickname.trim()) return;
        updateVal(nickname.trim());
    };

    return (
        <div className="flex h-screen w-screen flex-col items-center justify-center bg-amber-200">
            <form
                onSubmit={handleSubmit}
                className="flex flex-col items-center gap-4 rounded-xl bg-amber-50 p-8 shadow-md"
            >
                <h2 className="text-3xl font-semibold text-amber-800">
                    Who are you?
                </h2>

                <input
                    type="text"
                    value={nickname}
                    onChange={(e) => setNickname(e.target.value)}
                    placeholder="Enter your nickname"
                    className="w-64 rounded-lg border border-amber-500 p-3 text-center text-lg outline-none"
                />
                <button
                    type="submit"
                    className="w-64 rounded-lg bg-amber-500 py-3 text-lg font-medium text-white transition-colors hover:bg-amber-600 active:bg-amber-700"
                >
                    Join Game
                </button>
            </form>
        </div>
    );
};

export default NicknameForm;
