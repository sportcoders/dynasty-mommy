// -------------------- Imports -------------------
import { sleeper_getLeagueInfo } from "@services/sleeper";

import { useQuery } from "@tanstack/react-query";

/**
 * A utility function to recursively fetch previous seasons for a given fantasy league.
 *
 * It uses the Sleeper API to get a league's previous season ID and continues to
 * fetch backwards until there are no more previous leagues.
 *
 * @param league_id - The starting league ID.
 * 
 * @returns - A promise that resolves to an array of objects, where each object contains a league ID and its corresponding season.
 * @throws - Throws an error if a league is not found during the fetch.
 */
const fetchPreviousSeasons = async (league_id: string) => {
    const seasons: { league_id: string, season: string; }[] = [];
    let leagueId = league_id;
    while (leagueId && leagueId != '0') {
        const league = await sleeper_getLeagueInfo(leagueId);
        if (!league) {
            throw new Error("League not found");
        }
        seasons.push({ league_id: leagueId, season: league.season });
        leagueId = league.previous_league_id;
    }
    return seasons;
};

/**
 * A React hook that uses `@tanstack/react-query` to get all previous seasons for a given league.
 *
 * This hook handles the data fetching, caching, and state management for retrieving
 * a list of all historical leagues.
 *
 * @param league_id The current league ID to start fetching from.
 * @returns An object containing the fetched data, a boolean for the error state, and a boolean for the loading state.
 * @returns The query results.
 */
export default function useGetPreviousSeasons(league_id: string) {
    const { data: prevSeasons, isError: error, isPending: loading } = useQuery({
        queryKey: ['prevLeagues', league_id],
        queryFn: () => fetchPreviousSeasons(league_id),
    });
    return { prevSeasons, error, loading };
}