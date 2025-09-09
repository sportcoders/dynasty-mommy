// -------------------- Imports -------------------
import { sleeper_getPlayers } from "@services/sleeper";

import { useQuery } from "@tanstack/react-query";

/**
 * A custom React hook that uses `@tanstack/react-query` to fetch players from a Sleeper league.
 *
 * @param leagueId The ID of the Sleeper league.
 * @returns A query result object containing the fetched data and its state.
 * - `data`: A record mapping roster IDs to their player arrays, or `undefined` while loading or on error.
 * - `isLoading`: A boolean that is `true` while the query is in progress.
 * - `isError`: A boolean that is `true` if the query failed.
 */
export default function useSleeperPlayers(leagueId: string) {
    const { data, isLoading, error } = useQuery({
        queryKey: ['league', leagueId],
        queryFn: () => sleeper_getPlayers(leagueId),
        staleTime: 2 * 60 * 1000,          // fresh for 2 min
        refetchInterval: 5 * 60 * 1000,    // auto refetch every 5 min
        refetchIntervalInBackground: true, // keep updating when tab inactive
        gcTime: 15 * 60 * 1000,            // cached 15 min after unused
        enabled: !!leagueId,               // wait until leagueId is defined
        // TODO: Maybe add the 'select' option to add new metadata for new added/dropped players to show on the UI if needed
        // onSuccess and onError depracted in v5
    });

    return { data, isLoading, error };
}