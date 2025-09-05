// -------------------- Imports --------------------
import { useGetSavedLeagues } from "@hooks/useGetSavedLeagues";

import { type League } from "@services/api/user";
import { sleeper_getLeagueInfo, type League as SleeperLeague, } from "@services/sleeper";

import { useQueries, } from "@tanstack/react-query";

/**
 * Custom hook that fetches saved leagues and their detailed information for navigation bar display.
 * Combines saved leagues data with individual league information queries to provide
 * a complete dataset for navigation components.
 * 
 * @hook
 * @returns Object containing leagues data, loading state, and error state
 * @returns returns.leagues - Array of league information objects with name, ID, season, and avatar
 * @returns returns.loading - Boolean indicating if the initial saved leagues query is pending
 * @returns returns.error - Error object if the saved leagues query failed, otherwise undefined
 */
export function useGetSavedLeaguesNavBar() {
    const { isPending: loading, data: savedLeagues, error } = useGetSavedLeagues();

    const queries = useQueries({
        queries: savedLeagues ?
            savedLeagues.map((league) => {
                return {
                    queryKey: ['savedLeague', league.league_id],
                    queryFn: () => leagueInfoForPlatform(league),
                };
            })
            : []
    });

    const leagues = queries.map((league) => league.data).filter((l) => l != undefined);

    return { leagues, loading, error };
}

/**
 * Fetches detailed league information for a specific platform.
 * Currently supports Sleeper platform with extensible design for additional platforms.
 * 
 * @async
 * @function
 * @param savedLeague - The saved league object containing platform and league ID information
 * @returns Promise that resolves to a SleeperLeague object with standardized league information
 * @throws {Error} When an unsupported platform is provided
 */
const leagueInfoForPlatform = async (savedLeague: League): Promise<SleeperLeague> => {
    switch (savedLeague.platform) {
        case "sleeper": {
            const league = await sleeper_getLeagueInfo(savedLeague.league_id);
            return {
                name: league!.name,
                league_id: savedLeague.league_id,
                season: league!.season,
                avatar: league!.avatar

            };
        }
        default:
            throw new Error(`Unsupported platform: ${savedLeague.platform}`);
    }
};
