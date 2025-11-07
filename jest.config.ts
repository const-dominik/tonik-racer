import type { Config } from "jest";
import nextJest from "next/jest";

const createJestConfig = nextJest({ dir: "./frontend" });

const config: Config = {
    roots: ["<rootDir>/tests/unit"],
    coverageProvider: "v8",
    testEnvironment: "jsdom",
};

export default createJestConfig(config);
