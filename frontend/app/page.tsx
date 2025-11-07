"use client";

import { useEffect, useState } from "react";
import MainTonikRacer from "./components/MainTonikRacer";
import NicknameForm from "./components/NicknameForm";
import useLocalStorage from "./hooks/useLocalStorage";

const Home = () => {
    const [JWT] = useLocalStorage("user-jwt", "");
    const [nickname, setNickname] = useState("");
    const [hydrated, setHydrated] = useState(false);

    useEffect(() => {
        setHydrated(true);
    }, []);

    if (!hydrated) {
        // Don't render anything until hydration to avoid flash
        return null;
    }

    if (!JWT && !nickname) {
        return <NicknameForm setNickname={setNickname} />;
    }

    return <MainTonikRacer jwt={JWT} nickname={nickname} />;
};

export default Home;
