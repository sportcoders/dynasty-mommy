import { isUserLeague, type League } from "@services/api/user";
import { useQuery } from "@tanstack/react-query";
export default function useGetAllTransactions(league: League, disabled: boolean) {
    const { data, isError, isPending: loading } = useQuery({
        queryKey: ['league', league],
        queryFn: () => isUserLeague(league),
        enabled: !!league.league_id && !!league.platform && !disabled,
    });

    return { data, isError, loading };
}
