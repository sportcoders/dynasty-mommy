// -------------------- Imports -------------------
import { sleeper_getTransactionsWeek } from "@services/sleeper";

import { useQuery } from "@tanstack/react-query";

/**
 * A custom React hook that uses `@tanstack/react-query` to fetch a list of transactions for a specific week in a given league.
 *
 * @param league_id The unique ID of the fantasy league.
 * @param week The week number for which to fetch transactions.
 * @returns An object containing the query data and its state.
 * - `data`: The fetched array of transaction objects, or `undefined` while loading or on error.
 * - `isError`: A boolean that is `true` if the query failed.
 * - `loading`: A boolean that is `true` while the query is in progress.
 */
export default function useGetTransactionByWeek(league_id: string, week: number) {
    const { data, isError, isPending: loading } = useQuery({
        queryKey: ['league_id', league_id, week],
        queryFn: () => sleeper_getTransactionsWeek(league_id, week)
    });
    return { data, isError, loading };
}
