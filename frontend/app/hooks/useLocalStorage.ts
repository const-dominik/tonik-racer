"use client";

import { useState } from "react";

const useLocalStorage = <T>(key: string, defaultVal: T) => {
    const [value, setValue] = useState<T>(() => {
        try {
            const item = localStorage.getItem(key);
            if (!item) return defaultVal;
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
