import { getLeagueAndTeams } from "@services/api/yahoo";
import { useQuery } from "@tanstack/react-query";

export function useGetTeams(league_key: string) {
    const { data, isPending: loading, isError: error, error: errorMessage } = useQuery({
        queryKey: ["yahooLeagueTeams", league_key],
        queryFn: () => getLeagueAndTeams(league_key)
    });

    return { data, loading, error, errorMessage };
}