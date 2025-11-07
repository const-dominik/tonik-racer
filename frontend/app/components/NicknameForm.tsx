"use client";

import { useState } from "react";

export const NicknameForm = ({
    setNickname,
}: {
    setNickname: (val: string) => void;
}) => {
    const [formNick, setFormNick] = useState("");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!formNick.trim()) return;
        setNickname(formNick.trim());
    };

    return (
        <div className="flex h-screen w-screen flex-col items-center justify-center bg-amber-100">
            <form
                onSubmit={handleSubmit}
                className="flex flex-col items-center gap-4 rounded-xl bg-amber-50 p-8 shadow-md"
            >
                <h2 className="text-3xl font-semibold text-amber-800">
                    Who are you?
                </h2>

                <input
                    type="text"
                    value={formNick}
                    onChange={(e) => setFormNick(e.target.value)}
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
