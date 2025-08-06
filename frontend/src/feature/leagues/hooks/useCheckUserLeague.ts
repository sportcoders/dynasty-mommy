import { isUserLeague, type League } from "@services/api/user";
import { useQuery } from "@tanstack/react-query";
export default function useGetAllTransactions(league: League) {
    const { data, isError, isPending: loading } = useQuery({
        queryKey: ['league', league],
        queryFn: () => isUserLeague(league),
        enabled: !!league.league_id && !!league.platform,
    });

    return { data, isError, loading };
}
