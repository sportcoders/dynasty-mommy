// -------------------- Imports --------------------
import { sleeper_getLeagueInfo } from "@services/sleeper";

import { useQuery } from "@tanstack/react-query";

/**
 * Custom hook to fetch a Sleeper league's details.
 *
 * Uses React Query's `useQuery` to wrap the `sleeper_getLeagueInfo` API call.
 * The query is disabled by default (`enabled: false`) so you must call `refetch` manually.
 *
 * @param league_id - The Sleeper league ID to fetch.
 *
 * @returns An object containing query state and helpers:
 * - `data` - The fetched league data (if available).
 * - `isPending` - Whether the query is currently fetching.
 * - `isSuccess` - Whether the query completed successfully.
 * - `isError` - Whether the query failed.
 * - `error` - Error object if the query failed.
 * - `isFetched` - Whether the query has been executed at least once.
 * - `refetch` - Function to manually trigger the query.
 */
export default function useGetLeagueSleeper(league_id: string) {
    const { data, isPending, isSuccess, error, isFetched, refetch, isError } = useQuery({
        queryKey: ['sleeper_league', league_id],
        queryFn: () => sleeper_getLeagueInfo(league_id),
        enabled: false,
    });
    return { data, isPending, isSuccess, error, isFetched, refetch, isError };
}