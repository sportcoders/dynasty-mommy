import { sleeper_getPlayers } from "@services/sleeper";
import { useQuery } from "@tanstack/react-query";

/**
 * Fetches players using Sleeper API
 * @param leagueId - id of the Sleeper League
 * @returns {Object} Query result object
 * @returns {Player[] | undefined} returns.data - Array of player data from Sleeper API, undefined while loading or on error
 * @returns {boolean} returns.isLoading - Loading state of the query
 * @returns {Error | null} returns.error - Error object if query fails, null otherwise
 */;
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