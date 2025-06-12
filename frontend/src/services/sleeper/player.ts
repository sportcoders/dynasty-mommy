import { serverGet } from "./apiClient";
import type { Players } from "./types";

export const sleeper_getPlayer = async (playerId: string): Promise<Players> => {
    return serverGet<Players>(`/sleeper_player/${playerId}`);
};