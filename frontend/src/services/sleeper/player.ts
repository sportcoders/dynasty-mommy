import { serverGet } from "./apiClient";
import type { Player, Players } from "./types";

/**
 * Function to get Player object(s) from the backend API.
 * 
 * @param playerId the numerical player id
 * @returns an array of Player objects
 */
export const sleeper_getPlayer = async (playerId: string): Promise<Player[]> => {
    const players = await serverGet<Players>(`/sleeper_player/${playerId}`);

    if (!players || !players.players) {
        return [];
    }

    return players.players.map((player: Player) => ({
        id: player.id,
        first_name: player.first_name,
        last_name: player.last_name,
        position: player.position
    }));
};