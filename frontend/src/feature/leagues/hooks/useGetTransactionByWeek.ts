import { sleeper_getTransactionsWeek } from "@services/sleeper";
import { useQuery } from "@tanstack/react-query";
export default function useGetTransactionByWeek(league_id: string, week: number) {
    const { data, isError, isPending: loading } = useQuery({
        queryKey: ['league_id', league_id, week],
        queryFn: () => sleeper_getTransactionsWeek(league_id, week)
    });
    return { data, isError, loading };
}
