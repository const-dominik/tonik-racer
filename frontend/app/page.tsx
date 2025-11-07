"use client";

import { useEffect, useState } from "react";
import MainTonikRacer from "./components/MainTonikRacer";
import NicknameForm from "./components/NicknameForm";
import useLocalStorage from "./hooks/useLocalStorage";

const Home = () => {
    const [nickname, updateVal] = useLocalStorage("nickname", "");
    const [hydrated, setHydrated] = useState(false);

    useEffect(() => {
        setHydrated(true);
    }, []);

    if (!hydrated) {
        // Don't render anything until hydration to avoid flash
        return null;
    }

    if (!nickname) {
        return <NicknameForm updateVal={updateVal} />;
    }

    return <MainTonikRacer nickname={nickname} />;
};

export default Home;
