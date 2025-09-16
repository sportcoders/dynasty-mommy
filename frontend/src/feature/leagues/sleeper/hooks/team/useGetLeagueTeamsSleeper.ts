// -------------------- Imports -------------------
import { sleeper_getTeamInfo } from "@services/sleeper";
import { useQuery } from "@tanstack/react-query";



/**
 * Custom React hook that fetches all teams in a Sleeper league, including their avatars.
 *
 * Fetches team information and resolves each team's avatar image URL.
 * Handles loading and error states, and revokes avatar object URLs on cleanup.
 *
 * @param league_id - The unique identifier for the league.
 * @returns An object containing the loading state, error message, and array of teams (with avatars).
 */
export default function useGetLeagueTeamsSleeper(league_id: string) {
    const { data: teams, isPending: loading, isError: error } = useQuery({
        queryKey: ['sleeperLeagueTeams', league_id],
        queryFn: () => sleeper_getTeamInfo(league_id)
    });

    return { loading, error, teams };
}