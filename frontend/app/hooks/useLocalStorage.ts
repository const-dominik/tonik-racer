"use client";

import { useState } from "react";

const useLocalStorage = <T>(key: string, defaultVal: T) => {
    const [value, setValue] = useState<T>(() => {
        if (typeof window === "undefined") return defaultVal;
        const item = window.localStorage.getItem(key);
        if (!item) return defaultVal;
        try {
            return JSON.parse(item) as T;
        } catch {
            return defaultVal;
        }
    });

    const updateVal = (val: T) => {
        setValue(val);
        window.localStorage.setItem(key, JSON.stringify(val));
    };

    return [value, updateVal] as const;
};

export default useLocalStorage;
