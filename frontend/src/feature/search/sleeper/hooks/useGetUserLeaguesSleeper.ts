// -------------------- Imports --------------------
import { sleeper_getLeagues } from "@services/sleeper";

import { useQuery } from "@tanstack/react-query";

/**
 * Custom React hook that retrieves user league data from the Sleeper API by username
 * @param {string} username - The users sleeper username
 * @param {string} season - The fantasy season which the user would like to view their teams for
 * @returns {object} - object containg list of leagues, error and loading state
 */
export default function useGetUserLeaguesSleeper(
    username: string,
    season: string
) {
    const { isPending: loading, isError: error, data } = useQuery({
        queryKey: ['getLeaguesSleeperUsername', username, season],
        queryFn: () => sleeper_getLeagues(username, season),
    });
    return { leagues: data, loading, error };
}