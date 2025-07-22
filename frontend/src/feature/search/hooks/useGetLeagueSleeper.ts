import { sleeper_getLeagueInfo } from "@services/sleeper";
import { useQuery } from "@tanstack/react-query";

export default function useGetLeagueSleeper(league_id: string) {
    const { data, isPending, isSuccess, error, isFetched, refetch, isError } = useQuery({
        queryKey: ['sleeper_league', league_id],
        queryFn: () => sleeper_getLeagueInfo(league_id),
        enabled: false,
        retry: false
    });
    return { data, isPending, isSuccess, error, isFetched, refetch, isError };
}