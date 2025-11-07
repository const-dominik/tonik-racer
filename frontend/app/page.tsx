"use client";

import { useEffect } from "react";

const Home = () => {
    useEffect(() => {
        const checkServerCommunication = async () => {
            const response = await fetch("http://localhost:8000/ping");
            const data = await response.json();
            console.log(data);
        };
        checkServerCommunication();
    }, []);

    return <div>Hello world!</div>;
};

export default Home;
