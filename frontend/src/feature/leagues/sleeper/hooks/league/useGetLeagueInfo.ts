// -------------------- Imports -------------------
import { sleeper_getLeagueInfo } from "@services/sleeper";
import { useQuery } from "@tanstack/react-query";

/**
 * Custom React hook that retrieves Sleeper league scoring information and avatar.
 * 
 * Fetches league details such as points per shot, steal, etc., and resolves the league's avatar image URL.
 * Handles loading and error states, and revokes the avatar object URL on cleanup.
 *
 * @param league_id - The id of the league to fetch information for.
 * @returns An object containing the league info, loading status, and error message.
 */
export default function useGetLeagueInfo(league_id: string) {
    /**
     * Custom React hook that retrieves a sleeper league scoring information
     * ex. points per shot, steal, etc..
     * 
     * @param {string} leauge_id - the id of the league the user wants to view
     * 
     * @returns {object} - An object contain the league info, error and loading status
     */
    const { data: leagueInfo, isPending: loading, isError: error } = useQuery({
        queryFn: () => sleeper_getLeagueInfo(league_id),
        queryKey: ['sleeperLeagueInfo', league_id]
    });

    return { leagueInfo, loading, error };
}