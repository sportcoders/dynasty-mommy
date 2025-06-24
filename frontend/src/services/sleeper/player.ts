import { serverGet } from "./apiClient";
import type { Player, Players} from "./types";

/**
 * Function to get Player object(s) from the backend API.
 * 
 * @param playerId the numerical player id
 * @returns an array of Player objects
 */
export const sleeper_getPlayer = async (playerId: string): Promise<Player[]> => {
    try {
        const players = await serverGet<Players>(`/sleeper_player/${playerId}`);
        return players.players.map((player: Player) => ({
            id: player.id,
            first_name: player.first_name,
            last_name: player.last_name,
            position: player.position
        }));
    } catch (error) {
        console.error('Failed to fetch player(s):', error);
        return [];
    }
};