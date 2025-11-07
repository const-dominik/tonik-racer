import { Player } from "@/types/types";
import jwt from "jsonwebtoken";
import { z } from "zod";

const UserStatsSchema = z.object({
    nickname: z.string(),
    wins: z.number(),
    timestamp: z.number(),
});

type UserStats = z.infer<typeof UserStatsSchema>;

export const generateStatsToken = (nickname: string) => {
    if (!process.env.SECRET) throw new Error("secret not found!");

    const payload: UserStats = {
        nickname: nickname,
        wins: 0,
        timestamp: Date.now(),
    };

    return [jwt.sign(payload, process.env.SECRET!), payload] as const;
};

export const reissueToken = (player: Player) => {
    if (!process.env.SECRET) throw new Error("secret not found!");

    const payload: UserStats = {
        nickname: player.nickname,
        wins: player.wins,
        timestamp: player.timestamp!,
    };

    const token = jwt.sign(payload, process.env.SECRET);

    player.connection.send(JSON.stringify({ type: "JWT", value: token }));
    player.connection.send(JSON.stringify({ type: "stats", stats: payload }));
};

export const verifyStatsToken = (token: string): UserStats | null => {
    if (!process.env.SECRET) throw new Error("secret not found!");

    try {
        const decoded = jwt.verify(token, process.env.SECRET);
        if (typeof decoded !== "object" || decoded === null) return null;

        const parsed = UserStatsSchema.safeParse(decoded);
        if (!parsed.success) return null;

        return parsed.data;
    } catch (err) {
        return null;
    }
};
