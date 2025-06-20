import { serverGet } from "./apiClient";
import type { Player, Players} from "./types";

export const sleeper_getPlayer = async (playerId: string): Promise<Player[] | null> => {
    try {
        const res = await serverGet<Players>(`/sleeper_player/${playerId}`);
        return res.players.map((player: Player) => ({
            id: player.id,
            first_name: player.first_name,
            last_name: player.last_name,
            position: player.position
        }));
    } catch (error) {
        console.error('Failed to fetch player(s):', error);
        return null;
    }
};