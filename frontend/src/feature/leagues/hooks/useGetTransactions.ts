import { sleeper_getAllLeagueTransactions } from "@services/sleeper";
import { useQuery } from "@tanstack/react-query";

export default function useGetTransactions(league_id: string) {
    const { data, isError, isPending: loading } = useQuery({
        queryKey: ['league_id', league_id],
        queryFn: () => sleeper_getAllLeagueTransactions(league_id)
    });

    return { data, isError, loading };
}
